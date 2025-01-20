package com.example.hospitalscreenmanagement.ui

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.isVisible
import androidx.lifecycle.lifecycleScope
import com.bumptech.glide.Glide
import com.example.hospitalscreenmanagement.data.api.RetrofitClient
import com.example.hospitalscreenmanagement.data.model.MediaItemInfo
import com.example.hospitalscreenmanagement.data.model.Playlist
import com.example.hospitalscreenmanagement.databinding.ActivityPlayerBinding
import kotlinx.coroutines.launch

class PlayerActivity : AppCompatActivity() {
    private lateinit var binding: ActivityPlayerBinding
    private var currentMediaIndex = 0
    private var mediaItems: List<MediaItemInfo> = emptyList()
    private var currentHandler: Handler? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPlayerBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val screenId = intent.getStringExtra("SCREEN_ID") ?: return finish()
        loadScreenDetails(screenId)
    }

    private fun loadScreenDetails(screenId: String) {
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.apiService.getScreenDetails(screenId)
                if (response.isSuccessful) {
                    response.body()?.let { screen ->
                        screen.currentPlaylist?.let { playlist ->
                            loadPlaylistMedia(playlist._id)
                        } ?: run {
                            showError("Bu ekrana atanmış playlist bulunamadı")
                            finish()
                        }
                    }
                } else {
                    showError("Ekran detayları yüklenemedi")
                    finish()
                }
            } catch (e: Exception) {
                showError("Bağlantı hatası: ${e.message}")
                finish()
            }
        }
    }

    private suspend fun loadPlaylistMedia(playlistId: String) {
        try {
            val response = RetrofitClient.apiService.getPlaylistMedia(playlistId)
            if (response.isSuccessful) {
                mediaItems = response.body() ?: emptyList()
                if (mediaItems.isNotEmpty()) {
                    startMediaPlayback()
                } else {
                    showError("Playlist'te medya bulunamadı")
                    finish()
                }
            } else {
                showError("Playlist medyaları yüklenemedi")
                finish()
            }
        } catch (e: Exception) {
            showError("Medya yükleme hatası: ${e.message}")
            finish()
        }
    }

    private fun startMediaPlayback() {
        currentMediaIndex = 0
        showCurrentMedia()
    }

    private fun showCurrentMedia() {
        val media = mediaItems[currentMediaIndex]
        
        binding.imageView.isVisible = media.mediaType.equals("image", ignoreCase = true)
        binding.videoView.isVisible = media.mediaType.equals("video", ignoreCase = true)

        when {
            media.mediaType.equals("image", ignoreCase = true) -> {
                Glide.with(this)
                    .load(media.filePath)
                    .into(binding.imageView)
                scheduleNextMedia(media.duration * 1000L)
            }
            media.mediaType.equals("video", ignoreCase = true) -> {
                binding.videoView.apply {
                    setVideoPath(media.filePath)
                    setOnCompletionListener { showNextMedia() }
                    setOnErrorListener { _, _, _ ->
                        showNextMedia()
                        true
                    }
                    start()
                }
            }
        }
    }

    private fun scheduleNextMedia(delay: Long) {
        currentHandler?.removeCallbacksAndMessages(null)
        currentHandler = Handler(Looper.getMainLooper()).apply {
            postDelayed({ showNextMedia() }, delay)
        }
    }

    private fun showNextMedia() {
        currentMediaIndex = (currentMediaIndex + 1) % mediaItems.size
        showCurrentMedia()
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }

    override fun onDestroy() {
        super.onDestroy()
        currentHandler?.removeCallbacksAndMessages(null)
        binding.videoView.stopPlayback()
    }
} 