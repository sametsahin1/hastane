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
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay

class PlayerActivity : AppCompatActivity() {
    private lateinit var binding: ActivityPlayerBinding
    private lateinit var videoView: VideoView
    private lateinit var imageView: ImageView

    private var currentMediaIndex = 0
    private var mediaItems: List<MediaItemInfo> = emptyList()
    private var currentPlaylistId: String? = null

    private val handler = Handler(Looper.getMainLooper())
    private var configCheckJob: Job? = null
    private val CONFIG_CHECK_INTERVAL = 10000L // 10 saniyede bir kontrol et

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        supportActionBar?.hide() // Action bar'ı gizle
        binding = ActivityPlayerBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // View referanslarını alıyoruz
        videoView = binding.videoView
        imageView = binding.imageView

        // SCREEN_ID null veya boş gelirse aktiviteyi sonlandır
        val screenId = intent.getStringExtra("SCREEN_ID")
        if (screenId.isNullOrEmpty()) {
            finish()
            return
        }

        // İlk yükleme
        loadScreenDetails(screenId)
        
        // Periyodik kontrol başlat
        startConfigCheck(screenId)
    }

    private fun startConfigCheck(screenId: String) {
        configCheckJob?.cancel() // Varolan job'ı iptal et
        configCheckJob = lifecycleScope.launch {
            while (true) {
                delay(CONFIG_CHECK_INTERVAL)
                checkForConfigChanges(screenId)
            }
        }
    }

    private suspend fun checkForConfigChanges(screenId: String) {
        try {
            val response = RetrofitClient.apiService.getScreenDetails(screenId)
            if (response.isSuccessful) {
                response.body()?.let { screen ->
                    // Eğer playlist değiştiyse veya playlist boşsa
                    if (screen.currentPlaylist?.id != currentPlaylistId) {
                        Log.d("PlayerActivity", "Playlist değişikliği tespit edildi. Yeni playlist yükleniyor...")
                        // Mevcut medya oynatmayı durdur
                        handler.removeCallbacksAndMessages(null)
                        videoView.stopPlayback()
                        
                        // Yeni playlist'i yükle
                        screen.currentPlaylist?.let { playlist ->
                            currentPlaylistId = playlist.id
                            loadPlaylistMedia(playlist.id)
                        } ?: run {
                            showError("Bu ekrana atanmış playlist bulunamadı")
                            finish()
                        }
                    }
                }
            }
        } catch (e: Exception) {
            Log.e("PlayerActivity", "Konfig kontrolü hatası", e)
        }
    }

    /**
     * Belirtilen screenId'ye göre ekran detaylarını Retrofit üzerinden çeker.
     */
    private fun loadScreenDetails(screenId: String) {
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.apiService.getScreenDetails(screenId)
                if (response.isSuccessful) {
                    Log.d("PlayerActivity", "Screen response: ${response.body()}")

                    response.body()?.let { screen ->
                        // currentPlaylist null değilse medya listesini yükle
                        screen.currentPlaylist?.let { playlist ->
                            currentPlaylistId = playlist.id
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

    /**
     * Playlist ID'ye göre playlist detaylarını çeker ve MediaItem listesini alır.
     */
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

    /**
     * Medya oynatmayı başlatır.
     */
    private fun startMediaPlayback() {
        // Listedeki ilk medyadan başlayarak oynat
        showCurrentMedia()
    }

    /**
     * Şu anki medyayı ekranda gösterir (Video veya Resim).
     */
    private fun showCurrentMedia() {
        if (mediaItems.isEmpty()) return

        val mediaItem = mediaItems.getOrNull(currentMediaIndex) ?: return
        
        // Eğer media null ise, bir sonraki medyaya geç
        if (mediaItem.media == null) {
            handler.postDelayed({ showNextMedia() }, mediaItem.duration * 1000L)
            return
        }

        val currentMedia = mediaItem.media
        // Süreyi milisaniyeye çevir (saniye * 1000)
        val duration = mediaItem.duration * 1000L

        when (currentMedia.mediaType) {
            "Video" -> {
                videoView.visibility = View.VISIBLE
                imageView.visibility = View.GONE

                val videoUrl = "https://yazilimservisi.com${currentMedia.filePath}"
                Log.d("PlayerActivity", "Video URL: $videoUrl")

                videoView.setVideoPath(videoUrl)

                // Video hazır olduğunda oynat
                videoView.setOnPreparedListener { mp ->
                    mp.isLooping = false
                    videoView.start()
                }

                // Video yüklenemediğinde
                videoView.setOnErrorListener { _, what, extra ->
                    Log.e(
                        "PlayerActivity",
                        "Video yükleme hatası: what=$what, extra=$extra"
                    )
                    showError("Video yüklenemedi")
                    showNextMedia()
                    true
                }

                // Video bitince sıradaki medyaya geç
                videoView.setOnCompletionListener {
                    showNextMedia()
                }
            }

            "Resim" -> {
                videoView.visibility = View.GONE
                imageView.visibility = View.VISIBLE

                val imageUrl = "https://yazilimservisi.com${currentMedia.filePath}"
                Log.d("PlayerActivity", "Image URL: $imageUrl")

                val glideListener = object : RequestListener<Drawable> {
                    override fun onLoadFailed(
                        e: GlideException?,
                        model: Any?,
                        target: Target<Drawable>,
                        isFirstResource: Boolean
                    ): Boolean {
                        Log.e("PlayerActivity", "Resim yükleme hatası", e)
                        showError("Resim yüklenemedi")
                        showNextMedia()
                        return false
                    }

                    override fun onResourceReady(
                        resource: Drawable,
                        model: Any,
                        target: Target<Drawable>,
                        dataSource: DataSource,
                        isFirstResource: Boolean
                    ): Boolean {
                        // Resim başarıyla yüklendiyse, belirtilen süre kadar bekleyip sonraki medyaya geç
                        handler.postDelayed({ showNextMedia() }, duration)
                        return false
                    }
                }

                Glide.with(this)
                    .load(imageUrl)
                    .error(R.drawable.ic_error_image) // Bu drawable dosyanızda yoksa eklemeniz gerek
                    .addListener(glideListener)
                    .into(imageView)
            }

            else -> {
                Log.e("PlayerActivity", "Bilinmeyen medya tipi: ${currentMedia.mediaType}")
                showNextMedia()
            }
        }
    }

    /**
     * Bir sonraki medyaya geçiş yapar.
     */
    private fun showNextMedia() {
        // Daha önce beklemekte olan Runnable varsa iptal ediyoruz.
        handler.removeCallbacksAndMessages(null)

        // Döngüsel şekilde liste sonuna gelince başa dönmek için mod alarak index'i artırıyoruz
        currentMediaIndex = (currentMediaIndex + 1) % mediaItems.size

        // Yeni medyayı göster
        showCurrentMedia()
    }

    /**
     * Kullanıcıya Toast ile hata mesajı gösterir.
     */
    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }

    /**
     * Activity kapatılırken olası bellek sızıntısını önlemek için Handler ve VideoView temizle.
     */
    override fun onDestroy() {
        super.onDestroy()
        configCheckJob?.cancel() // Periyodik kontrolü durdur
        handler.removeCallbacksAndMessages(null)
        videoView.stopPlayback()
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        // SharedPreferences'dan son ekran ID'sini temizle
        getSharedPreferences("AppPrefs", MODE_PRIVATE).edit()
            .remove("last_screen_id")
            .apply()
            
        // Activity'yi sonlandır
        finish()
    }
}
