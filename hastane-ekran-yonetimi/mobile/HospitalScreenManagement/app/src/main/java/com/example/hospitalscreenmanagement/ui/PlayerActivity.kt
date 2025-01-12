package com.example.hospitalscreenmanagement.ui

import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.KeyEvent
import android.view.View
import android.view.WindowInsets
import android.view.WindowInsetsController
import android.view.WindowManager
import android.widget.ImageView
import android.widget.ProgressBar
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.hospitalscreenmanagement.R
import com.example.hospitalscreenmanagement.api.*
import com.squareup.picasso.Callback
import com.squareup.picasso.Picasso
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import com.example.hospitalscreenmanagement.api.ApiClient

class PlayerActivity : AppCompatActivity() {
    companion object {
        private const val TAG = "PlayerActivity"
    }

    private lateinit var imageView: ImageView
    private lateinit var progressBar: ProgressBar
    private val handler = Handler(Looper.getMainLooper())
    private var mediaList = listOf<MediaItem>()
    private var currentIndex = 0
    private val scope = CoroutineScope(Dispatchers.Main + Job())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_player)
        
        // View'ları başlat
        imageView = findViewById(R.id.imageView)
        progressBar = findViewById(R.id.progressBar)
        
        val screenId = intent.getStringExtra("SCREEN_ID")
        if (screenId == null) {
            showError("Ekran ID'si bulunamadı")
            return
        }
        
        loadScreenConfig(screenId)
    }
    
    private fun setupMediaPlayer(config: ScreenConfig) {
        // Playlist kontrolü
        if (config.playlist == null || config.playlist.mediaItems.isEmpty()) {
            showError("Bu ekran için medya listesi bulunamadı")
            return
        }

        // Medya listesini güncelle
        mediaList = config.playlist.mediaItems
        startPlaying()
    }

    private fun startPlaying() {
        currentIndex = 0
        playCurrent()
    }

    private fun playCurrent() {
        if (mediaList.isEmpty()) return

        if (currentIndex >= mediaList.size) {
            currentIndex = 0
        }

        val item = mediaList[currentIndex]
        when (item.mediaType.lowercase()) {
            "image" -> showImage(item.filePath, item.duration)
            "video" -> showError("Video oynatma henüz desteklenmiyor")
            else -> {
                Log.e(TAG, "Desteklenmeyen medya tipi: ${item.mediaType}")
                currentIndex++
                playCurrent()
            }
        }
    }

    private fun showImage(url: String, duration: Int) {
        progressBar.visibility = View.VISIBLE
        imageView.visibility = View.VISIBLE

        Picasso.get()
            .load(url)
            .fit()
            .centerInside()
            .into(imageView, object : Callback {
                override fun onSuccess() {
                    progressBar.visibility = View.GONE
                    // Sonraki medyaya geçmek için zamanlayıcı
                    handler.postDelayed({
                        currentIndex++
                        playCurrent()
                    }, duration * 1000L)
                }

                override fun onError(e: Exception) {
                    Log.e(TAG, "Resim yüklenirken hata: ${e.message}")
                    progressBar.visibility = View.GONE
                    currentIndex++
                    playCurrent()
                }
            })
    }

    private fun loadScreenConfig(screenId: String) {
        scope.launch {
            try {
                val config = withContext(Dispatchers.IO) {
                    ApiClient.api.getScreenConfig(screenId)
                }
                setupMediaPlayer(config)
            } catch (e: Exception) {
                Log.e(TAG, "Config yüklenirken hata", e)
                showError("Ekran konfigürasyonu yüklenemedi: ${e.localizedMessage}")
            }
        }
    }
    
    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
        finish()
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacksAndMessages(null)
    }
} 