class PlayerActivity : AppCompatActivity() {
    private lateinit var binding: ActivityPlayerBinding
    private var currentMediaIndex = 0
    private var mediaItems: List<MediaItemInfo> = emptyList()
    private var currentHandler: Handler? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPlayerBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val screenId = intent.getStringExtra(ScreenSelectionActivity.EXTRA_SCREEN_ID)
            ?: return finish()

        loadScreenConfig(screenId)
    }

    private fun loadScreenConfig(screenId: String) {
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.apiService.getScreenConfig(screenId)
                if (response.isSuccessful) {
                    response.body()?.let { config ->
                        mediaItems = config.playlist.mediaItems
                        if (mediaItems.isNotEmpty()) {
                            startMediaPlayback()
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

    private fun showCurrentMedia() {
        val media = mediaItems[currentMediaIndex]
        
        binding.imageView.isVisible = media.mediaType == "Resim"
        binding.videoView.isVisible = media.mediaType == "Video"

        when (media.mediaType) {
            "Resim" -> {
                Glide.with(this)
                    .load(media.filePath)
                    .into(binding.imageView)
                
                scheduleNextMedia(media.duration * 1000L)
            }
            "Video" -> {
                binding.videoView.apply {
                    setVideoPath(media.filePath)
                    setOnCompletionListener {
                        showNextMedia()
                    }
                    start()
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
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }

    override fun onDestroy() {
        super.onDestroy()
        currentHandler?.removeCallbacksAndMessages(null)
    }
} 