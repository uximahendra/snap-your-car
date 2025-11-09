package app.lovable.snapyourcar;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    
    private static final int CAMERA_PERMISSION_REQUEST_CODE = 1001;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Request Android system camera permission FIRST
        checkAndRequestPermissions();
    }
    
    @Override
    public void onStart() {
        super.onStart();
        
        // Configure WebView settings for camera access
        if (this.bridge != null && this.bridge.getWebView() != null) {
            WebSettings webSettings = this.bridge.getWebView().getSettings();
            
            // Enable camera/microphone access in WebView
            webSettings.setJavaScriptEnabled(true);
            webSettings.setDomStorageEnabled(true);
            webSettings.setMediaPlaybackRequiresUserGesture(false);
            webSettings.setAllowFileAccess(true);
            webSettings.setAllowContentAccess(true);
            
            // Set custom WebChromeClient to grant WebView permissions
            this.bridge.getWebView().setWebChromeClient(new WebChromeClient() {
                @Override
                public void onPermissionRequest(final PermissionRequest request) {
                    // Check if system permission is granted
                    if (ContextCompat.checkSelfPermission(MainActivity.this, 
                            Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
                        
                        // Grant WebView permission immediately
                        MainActivity.this.runOnUiThread(() -> {
                            request.grant(request.getResources());
                        });
                    } else {
                        // Deny WebView request if system permission not granted
                        MainActivity.this.runOnUiThread(() -> {
                            request.deny();
                        });
                    }
                }
            });
        }
    }
    
    private void checkAndRequestPermissions() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.CAMERA},
                    CAMERA_PERMISSION_REQUEST_CODE);
        }
    }
    
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        
        if (requestCode == CAMERA_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // Permission granted - reload the page to trigger camera init again
                if (this.bridge != null && this.bridge.getWebView() != null) {
                    this.bridge.getWebView().reload();
                }
            }
        }
    }
}
