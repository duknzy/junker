package com.flora.app;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onStart() {
        super.onStart();
        if (getBridge() != null && getBridge().getWebView() != null) {
            WebView webView = getBridge().getWebView();
            WebSettings settings = webView.getSettings();

            // Google OAuth blocks default WebView User-Agent containing "; wv" and "Version/4.0".
            // Cleaning User-Agent allows Google Sign-In to be accepted by accounts.google.com without external browser.
            String ua = settings.getUserAgentString();
            if (ua != null) {
                String cleanUa = ua.replace("; wv", "").replaceAll("Version\\/\\d+\\.\\d+\\s*", "");
                settings.setUserAgentString(cleanUa);
            }

            settings.setJavaScriptEnabled(true);
            settings.setDomStorageEnabled(true);
            settings.setDatabaseEnabled(true);
        }
    }

    @Override
    public void onBackPressed() {
        if (getBridge() != null && getBridge().getWebView() != null && getBridge().getWebView().canGoBack()) {
            getBridge().getWebView().goBack();
        } else {
            super.onBackPressed();
        }
    }
}
