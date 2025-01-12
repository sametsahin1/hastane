class ScreenSelectionActivity : AppCompatActivity() {
    private lateinit var binding: ActivityScreenSelectionBinding
    private val screenList = mutableListOf<Screen>()
    private var selectedScreen: Screen? = null
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityScreenSelectionBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupRecyclerView()
        fetchScreens()
        
        binding.buttonNext.setOnClickListener {
            selectedScreen?.let { screen ->
                proceedWithSelectedScreen(screen)
            } ?: run {
                Toast.makeText(this, "Lütfen bir ekran seçin", Toast.LENGTH_SHORT).show()
            }
        }
    }
    
    private fun setupRecyclerView() {
        binding.recyclerViewScreens.apply {
            layoutManager = LinearLayoutManager(this@ScreenSelectionActivity)
            adapter = ScreenAdapter(screenList) { screen ->
                selectedScreen = screen
                // Seçili ekranı görsel olarak belirt
            }
        }
    }
    
    private fun fetchScreens() {
        RetrofitClient.api.getScreens().enqueue(object : Callback<List<Screen>> {
            override fun onResponse(call: Call<List<Screen>>, response: Response<List<Screen>>) {
                if (response.isSuccessful) {
                    response.body()?.let { screens ->
                        screenList.clear()
                        screenList.addAll(screens)
                        binding.recyclerViewScreens.adapter?.notifyDataSetChanged()
                        
                        if (screens.isEmpty()) {
                            showError("Hiç ekran bulunamadı")
                        }
                    }
                } else {
                    showError("Ekranlar yüklenirken hata oluştu: ${response.code()}")
                }
            }
            
            override fun onFailure(call: Call<List<Screen>>, t: Throwable) {
                showError("Ağ hatası: ${t.message}")
            }
        })
    }
    
    private fun proceedWithSelectedScreen(screen: Screen) {
        // Seçilen ekranın geçerliliğini kontrol et
        RetrofitClient.api.getScreen(screen.id).enqueue(object : Callback<Screen> {
            override fun onResponse(call: Call<Screen>, response: Response<Screen>) {
                if (response.isSuccessful) {
                    // Ana ekrana geç
                    startActivity(Intent(this@ScreenSelectionActivity, MainActivity::class.java).apply {
                        putExtra("SCREEN_ID", screen.id)
                        putExtra("SCREEN_NAME", screen.name)
                    })
                    finish()
                } else {
                    showError("Geçersiz ekran seçimi")
                }
            }
            
            override fun onFailure(call: Call<Screen>, t: Throwable) {
                showError("Ağ hatası: ${t.message}")
            }
        })
    }
    
    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }
} 