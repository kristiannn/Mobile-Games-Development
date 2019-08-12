package com.example.kristiyan.mgd1coursework;

import android.content.pm.ActivityInfo;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class MainActivity extends AppCompatActivity {

    WebView webView;
    iSound iS;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        View decorView = getWindow().getDecorView();
        //Set the immersive flag.
        //set the content to appear under the system bars so that the content
        //doesn't recognize when the system bars hide and show

        int uiOptions = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                |View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                |View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                |View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                |View.SYSTEM_UI_FLAG_FULLSCREEN
                |View.SYSTEM_UI_FLAG_IMMERSIVE;
        decorView.setSystemUiVisibility(uiOptions);

        setContentView(R.layout.activity_main);
        iS = new iSound(getApplicationContext());

        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        webView = (WebView)findViewById(R.id.webview1);

        webView.getSettings().setJavaScriptEnabled(true);
        webView.loadUrl("file:///android_asset/Game.html");

        webView.addJavascriptInterface(iS, "soundMgr");
        WebSettings settings = webView.getSettings();
        settings.setDomStorageEnabled(true);
    }
}