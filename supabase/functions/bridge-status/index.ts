
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("Bridge Order Status Function Loaded");

const FF_API_URL = "https://ff.io/api/v2";
const FF_API_KEY = Deno.env.get("FF_API_KEY") || "bzplvDU0N2Pa5crmQTbqteew6WJyuSGX9BEBPclU";
const FF_API_SECRET = Deno.env.get("FF_API_SECRET") || "qIk7Vd6b5M3wqOmD3cnqRGQ6k3dGTDss47fvdng4";

async function generateSignature(body: any): Promise<string> {
  const encoder = new TextEncoder();
  const bodyStr = JSON.stringify(body);
  
  // Log the input values for debugging
  console.log("Generating signature for body:", bodyStr);
  console.log("Using API secret with length:", FF_API_SECRET.length);
  
  // Ensure FF_API_SECRET is not empty
  if (!FF_API_SECRET || FF_API_SECRET.length === 0) {
    throw new Error("API Secret is empty or undefined");
  }
  
  const key = encoder.encode(FF_API_SECRET);
  const message = encoder.encode(bodyStr);
  
  // Double-check key length after encoding
  if (key.length === 0) {
    console.error("Key length is zero after encoding");
    throw new Error("Key length is zero after encoding");
  }
  
  try {
    // Import the key for HMAC
    const cryptoKey = await crypto.subtle.importKey(
      "raw", 
      key, 
      { name: "HMAC", hash: "SHA-256" }, 
      false, 
      ["sign"]
    );
    
    // Sign the message
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC", 
      cryptoKey, 
      message
    );
    
    // Convert to hex
    return Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch (error) {
    console.error("Error in signature generation:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    console.log("Processing bridge status request");
    const requestData = await req.json();
    
    // Extract id and token from the request
    const { id, token } = requestData;
    
    if (!id || !token) {
      return new Response(
        JSON.stringify({
          code: 400,
          msg: "Missing order ID or token",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log(`Fetching order status for ID: ${id}`);
    
    // Prepare request body for FixedFloat API
    const requestBody = { id, token };
    const requestBodyStr = JSON.stringify(requestBody);
    
    console.log("Request body:", requestBodyStr);
    console.log("API Secret Length:", FF_API_SECRET.length);
    
    // Generate signature
    const signature = await generateSignature(requestBody);
    
    console.log(`Generated signature: ${signature}`);
    
    // Debugging information
    const debugInfo = {
      requestDetails: {
        url: `${FF_API_URL}/order`,
        method: "POST",
        requestBody,
        requestBodyString: requestBodyStr
      },
      signatureInfo: {
        signature,
        apiKey: FF_API_KEY,
        secretLength: FF_API_SECRET.length
      },
      curlCommand: `curl -X POST \\
  -H "Accept: application/json" \\
  -H "X-API-KEY: ${FF_API_KEY}" \\
  -H "X-API-SIGN: ${signature}" \\
  -H "Content-Type: application/json; charset=UTF-8" \\
  -d '${requestBodyStr}' \\
  "${FF_API_URL}/order" -L`
    };
    
    console.log("Debug Info:", JSON.stringify(debugInfo, null, 2));
    
    // Call the FixedFloat API
    const response = await fetch(`${FF_API_URL}/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": FF_API_KEY,
        "X-API-SIGN": signature,
      },
      body: requestBodyStr,
    });
    
    // Get the response body as text
    const responseText = await response.text();
    
    // Update debug info with response details
    debugInfo.responseDetails = {
      status: response.status.toString(),
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText
    };
    
    if (!response.ok) {
      console.error(`API Error (${response.status}): ${responseText}`);
      
      return new Response(
        JSON.stringify({
          code: response.status,
          msg: `API Error: ${response.statusText}`,
          details: responseText,
          debugInfo
        }),
        {
          status: response.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    // Try to parse the response as JSON
    let apiResponse;
    try {
      apiResponse = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse API response as JSON:", e);
      return new Response(
        JSON.stringify({
          code: 500,
          msg: "Failed to parse API response",
          details: e.message,
          debugInfo
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    console.log("API Response:", JSON.stringify(apiResponse));
    
    // Include debug info in the response
    apiResponse.debugInfo = debugInfo;
    
    return new Response(
      JSON.stringify(apiResponse),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error handling request:", error);
    
    return new Response(
      JSON.stringify({
        code: 500,
        msg: "Internal server error",
        details: error.message,
        stack: error.stack
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
