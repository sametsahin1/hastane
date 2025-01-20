package com.example.hospitalscreenmanagement.ui

import android.graphics.drawable.Drawable
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.WindowManager
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.isVisible
import androidx.lifecycle.lifecycleScope
import com.bumptech.glide.Glide
import com.bumptech.glide.load.DataSource
import com.bumptech.glide.load.engine.GlideException
import com.bumptech.glide.request.RequestListener
import com.bumptech.glide.request.target.Target
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
    private var isPlaying = true  // Oynatma durumunu takip et

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPlayerBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Tam ekran yap
        window.addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN)
        supportActionBar?.hide()

        val screenId = intent.getStringExtra("SCREEN_ID") ?: return finish()
        loadScreenConfig(screenId)

        // Dokunma olaylarını dinle
        binding.root.setOnClickListener {
            togglePlayPause()
        }
    }

    private fun loadScreenConfig(screenId: String) {
        lifecycleScope.launch {
            try {
                // Önce ekran detaylarını al
                val screenResponse = RetrofitClient.apiService.getScreenDetails(screenId)
                if (screenResponse.isSuccessful) {
                    screenResponse.body()?.let { screenDetail ->
                        // Playlist'i ekran detaylarından al
                        screenDetail.currentPlaylist?.let { playlist ->
                            // Playlist'in medya öğelerini al
                            val mediaResponse = RetrofitClient.apiService.getPlaylistMedia(playlist._id)
                            if (mediaResponse.isSuccessful) {
                                mediaItems = mediaResponse.body() ?: emptyList()
                                if (mediaItems.isNotEmpty()) {
                                    startMediaPlayback()
                                } else {
                                    showError("Oynatma listesinde medya öğesi bulunamadı")
                                    finish()
                                }
                            } else {
                                showError("Medya listesi yüklenemedi")
                                finish()
                            }
                        } ?: run {
                            showError("Ekrana atanmış oynatma listesi bulunamadı")
                            finish()
                        }
                    }
                } else {
                    showError("Ekran yapılandırması yüklenemedi")
                    finish()
                }
            } catch (e: Exception) {
                showError("Bağlantı hatası: ${e.message}")
                finish()
            }
        }
    }

    private fun startMediaPlayback() {
        showCurrentMedia()
    }

    private fun togglePlayPause() {
        isPlaying = !isPlaying
        if (isPlaying) {
            startMediaPlayback()
        } else {
            currentHandler?.removeCallbacksAndMessages(null)
            binding.videoView.pause()
        }
        
        // Oynatma durumunu göster
        Toast.makeText(this, if (isPlaying) "Oynatılıyor" else "Duraklatıldı", Toast.LENGTH_SHORT).show()
    }

    private fun showCurrentMedia() {
        if (mediaItems.isEmpty()) return
        if (!isPlaying) return
        
        val media = mediaItems[currentMediaIndex]
        
        // Yükleniyor göstergesi
        binding.progressBar.isVisible = true
        binding.imageView.isVisible = false
        binding.videoView.isVisible = false

        when {
            media.mediaType.equals("image", ignoreCase = true) -> {
                binding.imageView.isVisible = true
                binding.videoView.isVisible = false
                
                Glide.with(this)
                    .load(media.filePath)
                    .listener(object : RequestListener<Drawable> {
                        override fun onLoadFailed(e: GlideException?, model: Any?, target: Target<Drawable>?, isFirstResource: Boolean): Boolean {
                            binding.progressBar.isVisible = false
                            showError("Resim yüklenemedi: ${e?.message}")
                            showNextMedia()
                            return false
                        }

                        override fun onResourceReady(resource: Drawable?, model: Any?, target: Target<Drawable>?, dataSource: DataSource?, isFirstResource: Boolean): Boolean {
                            binding.progressBar.isVisible = false
                            return false
                        }
                    })
                    .into(binding.imageView)
                
                scheduleNextMedia(media.duration * 1000L)
            }
            media.mediaType.equals("video", ignoreCase = true) -> {
                binding.imageView.isVisible = false
                binding.videoView.isVisible = true
                
                binding.videoView.apply {
                    setVideoPath(media.filePath)
                    setOnPreparedListener { mp ->
                        binding.progressBar.isVisible = false
                        mp.start()
                    }
                    setOnCompletionListener {
                        showNextMedia()
                    }
                    setOnErrorListener { _, what, extra ->
                        binding.progressBar.isVisible = false
                        showError("Video oynatma hatası: $what, $extra")
                        showNextMedia()
                        true
                    }
                }
            }
        }
    }

    private fun scheduleNextMedia(delay: Long) {
        currentHandler?.removeCallbacksAndMessages(null)
        currentHandler = Handler(Looper.getMainLooper()).apply {
            postDelayed({
                showNextMedia()
            }, delay)
        }
    }

    private fun showNextMedia() {
        currentMediaIndex = (currentMediaIndex + 1) % mediaItems.size
        showCurrentMedia()
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    override fun onDestroy() {
        super.onDestroy()
        currentHandler?.removeCallbacksAndMessages(null)
        binding.videoView.stopPlayback()
    }
} 