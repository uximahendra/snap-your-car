package app.lovable.snapyourcar;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    
    private static final int CAMERA_PERMISSION_REQUEST_CODE = 1001;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Request Android system camera permission first
        checkAndRequestPermissions();
    }
    
    @Override
    public void onStart() {
        super.onStart();
        
        // Set custom WebChromeClient after bridge is ready
        if (this.bridge != null && this.bridge.getWebView() != null) {
            this.bridge.getWebView().setWebChromeClient(new WebChromeClient() {
                @Override
                public void onPermissionRequest(final PermissionRequest request) {
                    // Check if we have system permission
                    if (ContextCompat.checkSelfPermission(MainActivity.this, 
                            Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
                        
                        // Grant WebView permission
                        MainActivity.this.runOnUiThread(() -> {
                            request.grant(request.getResources());
                        });
                    } else {
                        // Request system permission first
                        ActivityCompat.requestPermissions(MainActivity.this,
                                new String[]{Manifest.permission.CAMERA},
                                CAMERA_PERMISSION_REQUEST_CODE);
                        request.deny();
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
}
