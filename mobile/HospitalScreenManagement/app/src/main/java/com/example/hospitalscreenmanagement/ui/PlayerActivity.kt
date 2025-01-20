package com.example.hospitalscreenmanagement.ui

import android.graphics.drawable.Drawable
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.View
import android.widget.ImageView
import android.widget.Toast
import android.widget.VideoView
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.bumptech.glide.Glide
import com.bumptech.glide.load.DataSource
import com.bumptech.glide.load.engine.GlideException
import com.bumptech.glide.request.RequestListener
import com.bumptech.glide.request.target.Target
import com.example.hospitalscreenmanagement.R
import com.example.hospitalscreenmanagement.data.api.RetrofitClient
import com.example.hospitalscreenmanagement.data.model.MediaItemInfo
import com.example.hospitalscreenmanagement.data.model.Playlist
import com.example.hospitalscreenmanagement.databinding.ActivityPlayerBinding
import kotlinx.coroutines.launch

class PlayerActivity : AppCompatActivity() {
    private lateinit var binding: ActivityPlayerBinding
    private lateinit var videoView: VideoView
    private lateinit var imageView: ImageView
    private var currentMediaIndex = 0
    private var mediaItems: List<MediaItemInfo> = emptyList()
    private val handler = Handler(Looper.getMainLooper())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPlayerBinding.inflate(layoutInflater)
        setContentView(binding.root)

        videoView = binding.videoView
        imageView = binding.imageView

        val screenId = intent.getStringExtra("SCREEN_ID") ?: return finish()
        loadScreenDetails(screenId)
    }

    private fun loadScreenDetails(screenId: String) {
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.apiService.getScreenDetails(screenId)
                if (response.isSuccessful) {
                    Log.d("PlayerActivity", "Screen response: ${response.body()}")
                    
                    response.body()?.let { screen ->
                        screen.currentPlaylist?.let { playlist ->
                            loadPlaylistMedia(playlist.id)
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
                Log.e("PlayerActivity", "Ekran detayları yükleme hatası", e)
                showError("Bağlantı hatası: ${e.message}")
                finish()
            }
        }
    }

    private suspend fun loadPlaylistMedia(playlistId: String) {
        try {
            val response = RetrofitClient.apiService.getPlaylistDetails(playlistId)
            if (response.isSuccessful) {
                Log.d("PlayerActivity", "Playlist response: ${response.body()}")
                
                response.body()?.let { playlist ->
                    mediaItems = playlist.mediaItems
                    Log.d("PlayerActivity", "Media items: $mediaItems")
                    
                    if (mediaItems.isNotEmpty()) {
                        startMediaPlayback()
                    } else {
                        showError("Playlist'te medya bulunamadı")
                        finish()
                    }
                }
            } else {
                showError("Playlist detayları yüklenemedi")
                finish()
            }
        } catch (e: Exception) {
            Log.e("PlayerActivity", "Medya yükleme hatası", e)
            showError("Medya yükleme hatası: ${e.message}")
            finish()
        }
    }

    private fun startMediaPlayback() {
        showCurrentMedia()
    }

    private fun showCurrentMedia() {
        if (mediaItems.isEmpty()) return

        val mediaItem = mediaItems.getOrNull(currentMediaIndex) ?: return
        val currentMedia = mediaItem.media ?: run {
            Log.e("PlayerActivity", "Media bilgisi null: $mediaItem")
            showError("Medya bilgisi bulunamadı")
            return
        }

        val duration = mediaItem.duration * 1000L // saniyeyi milisaniyeye çevir

        when (currentMedia.mediaType) {
            "Video" -> {
                videoView.visibility = View.VISIBLE
                imageView.visibility = View.GONE
                
                val videoUrl = "https://yazilimservisi.com${currentMedia.filePath}"
                Log.d("PlayerActivity", "Video URL: $videoUrl")
                
                videoView.setVideoPath(videoUrl)
                videoView.setOnPreparedListener { mp ->
                    mp.isLooping = false
                    videoView.start()
                }
                videoView.setOnErrorListener { mp, what, extra ->
                    Log.e("PlayerActivity", "Video yükleme hatası: what=$what, extra=$extra")
                    showError("Video yüklenemedi")
                    showNextMedia()
                    true
                }
                videoView.setOnCompletionListener {
                    showNextMedia()
                }
            }
            "Resim" -> {
                videoView.visibility = View.GONE
                imageView.visibility = View.VISIBLE
                
                val imageUrl = "https://yazilimservisi.com${currentMedia.filePath}"
                Log.d("PlayerActivity", "Image URL: $imageUrl")
                
                Glide.with(this)
                    .load(imageUrl)
                    .error(R.drawable.error_image) // Hata durumunda gösterilecek resim
                    .listener(object : RequestListener<Drawable> {
                        override fun onLoadFailed(
                            e: GlideException?,
                            model: Any?,
                            target: Target<Drawable>?,
                            isFirstResource: Boolean
                        ): Boolean {
                            Log.e("PlayerActivity", "Resim yükleme hatası", e)
                            showError("Resim yüklenemedi")
                            showNextMedia()
                            return false
                        }

                        override fun onResourceReady(
                            resource: Drawable?,
                            model: Any?,
                            target: Target<Drawable>?,
                            dataSource: DataSource?,
                            isFirstResource: Boolean
                        ): Boolean {
                            handler.postDelayed({ showNextMedia() }, duration)
                            return false
                        }
                    })
                    .into(imageView)
            }
            else -> {
                Log.e("PlayerActivity", "Bilinmeyen medya tipi: ${currentMedia.mediaType}")
                showNextMedia()
            }
        }
    }

    private fun showNextMedia() {
        handler.removeCallbacksAndMessages(null) // Önceki zamanlayıcıyı iptal et
        currentMediaIndex = (currentMediaIndex + 1) % mediaItems.size
        showCurrentMedia()
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacksAndMessages(null)
        videoView.stopPlayback()
    }
} 