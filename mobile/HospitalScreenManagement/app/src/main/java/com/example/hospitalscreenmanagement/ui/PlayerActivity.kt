package com.example.hospitalscreenmanagement.ui

import android.net.Uri
import android.os.Bundle
import android.widget.ImageView
import android.widget.VideoView
import android.widget.MediaController
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.hospitalscreenmanagement.R
import com.example.hospitalscreenmanagement.api.ApiClient
import com.example.hospitalscreenmanagement.api.MediaItem
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import com.squareup.picasso.Picasso

class PlayerActivity : AppCompatActivity() {
    private lateinit var imageView: ImageView
    private lateinit var videoView: VideoView
    private var currentMediaIndex = 0
    private var mediaItems = listOf<MediaItem>()
    private val baseUrl = "http://10.0.2.2:3000" // API base URL

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_player)

        imageView = findViewById(R.id.imageView)
        videoView = findViewById(R.id.videoView)

        val screenId = intent.getStringExtra("SCREEN_ID") ?: return finish()
        
        setupVideoView()
        loadScreenConfig(screenId)
    }

    private fun setupVideoView() {
        val mediaController = MediaController(this)
        mediaController.setAnchorView(videoView)
        videoView.setMediaController(mediaController)
        
        videoView.setOnCompletionListener {
            playNextMedia()
        }
    }

    private fun loadScreenConfig(screenId: String) {
        lifecycleScope.launch {
            try {
                val config = ApiClient.api.getScreenConfig(screenId)
                mediaItems = config.playlist.mediaItems
                if (mediaItems.isNotEmpty()) {
                    startMediaPlayback()
                }
            } catch (e: Exception) {
                Toast.makeText(this@PlayerActivity, "Yapılandırma yüklenemedi: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun startMediaPlayback() {
        if (mediaItems.isNotEmpty()) {
            playCurrentMedia()
        }
    }

    private fun playCurrentMedia() {
        val currentMedia = mediaItems[currentMediaIndex]
        
        // Tüm medya görünümlerini gizle
        imageView.visibility = View.GONE
        videoView.visibility = View.GONE

        when (currentMedia.mediaType) {
            "image" -> {
                imageView.visibility = View.VISIBLE
                val imageUrl = baseUrl + currentMedia.filePath
                Picasso.get()
                    .load(imageUrl)
                    .fit()
                    .centerCrop()
                    .into(imageView)
                
                // Belirtilen süre sonra sonraki medyaya geç
                lifecycleScope.launch {
                    delay(currentMedia.duration * 1000L)
                    playNextMedia()
                }
            }
            "video" -> {
                videoView.visibility = View.VISIBLE
                val videoUrl = baseUrl + currentMedia.filePath
                videoView.setVideoURI(Uri.parse(videoUrl))
                videoView.start()
            }
        }
    }

    private fun playNextMedia() {
        currentMediaIndex = (currentMediaIndex + 1) % mediaItems.size
        playCurrentMedia()
    }

    override fun onPause() {
        super.onPause()
        videoView.pause()
    }

    override fun onDestroy() {
        super.onDestroy()
        videoView.stopPlayback()
    }
} 