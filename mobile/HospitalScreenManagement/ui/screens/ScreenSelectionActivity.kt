import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch

class ScreenSelectionActivity : AppCompatActivity() {
    private lateinit var binding: ActivityScreenSelectionBinding
    private val screenAdapter = ScreenAdapter { screen ->
        navigateToPlayer(screen._id)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityScreenSelectionBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupRecyclerView()
        loadScreens()
    }

    private fun setupRecyclerView() {
        binding.recyclerViewScreens.apply {
            layoutManager = LinearLayoutManager(this@ScreenSelectionActivity)
            adapter = screenAdapter
        }
    }

    private fun loadScreens() {
        lifecycleScope.launch {
            try {
                binding.progressBar.isVisible = true
                val response = RetrofitClient.apiService.getScreens()
                if (response.isSuccessful) {
                    response.body()?.let { screens ->
                        screenAdapter.submitList(screens)
                    }
                } else {
                    showError("Ekranlar yüklenirken hata oluştu")
                }
            } catch (e: Exception) {
                showError("Bağlantı hatası: ${e.message}")
            } finally {
                binding.progressBar.isVisible = false
            }
        }
    }

    private fun navigateToPlayer(screenId: String) {
        val intent = Intent(this, PlayerActivity::class.java).apply {
            putExtra(EXTRA_SCREEN_ID, screenId)
        }
        startActivity(intent)
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }

    companion object {
        const val EXTRA_SCREEN_ID = "extra_screen_id"
    }
} 