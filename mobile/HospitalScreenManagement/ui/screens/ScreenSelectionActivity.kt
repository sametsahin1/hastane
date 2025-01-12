class ScreenSelectionActivity : AppCompatActivity() {
    private lateinit var binding: ActivityScreenSelectionBinding
    private val screenList = mutableListOf<Screen>()
    private var selectedScreen: Screen? = null
    private val scope = CoroutineScope(Dispatchers.Main + Job())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityScreenSelectionBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupRecyclerView()
        fetchScreens()
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
        scope.launch {
            try {
                val response = withContext(Dispatchers.IO) {
                    RetrofitClient.api.getScreens()
                }

                if (response.isSuccessful) {
                    response.body()?.let { screens ->
                        // Debug için ham veriyi logla
                        Log.d("API_DEBUG", "Raw response: ${gson.toJson(screens)}")
                        
                        screenList.clear()
                        screenList.addAll(screens)
                        
                        // Her ekranı kontrol et
                        screenList.forEach { screen ->
                            Log.d("SCREEN_DEBUG", """
                                Screen Data:
                                ID: ${screen.id}
                                ScreenName: ${screen.screenName}
                                Location: ${screen.location}
                                IsActive: ${screen.isActive}
                            """.trimIndent())
                        }
                        
                        binding.recyclerViewScreens.adapter?.notifyDataSetChanged()
                    }
                } else {
                    Log.e("API_ERROR", "Error: ${response.code()} - ${response.errorBody()?.string()}")
                }
            } catch (e: Exception) {
                Log.e("API_ERROR", "Network error", e)
            }
        }
    }

    // Screen adapter sınıfı
    private class ScreenAdapter(
        private val screens: List<Screen>,
        private val onScreenSelected: (Screen) -> Unit
    ) : RecyclerView.Adapter<ScreenAdapter.ViewHolder>() {

        class ViewHolder(val binding: ItemScreenBinding) : RecyclerView.ViewHolder(binding.root)

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
            val binding = ItemScreenBinding.inflate(
                LayoutInflater.from(parent.context), parent, false
            )
            return ViewHolder(binding)
        }

        override fun onBindViewHolder(holder: ViewHolder, position: Int) {
            val screen = screens[position]
            holder.binding.apply {
                // screenName'i doğrudan kullan
                textViewScreenName.text = screen.screenName
                textViewLocation.text = screen.location ?: "Konum belirtilmemiş"
                
                // Debug için
                Log.d("SCREEN_BINDING", """
                    Binding screen at position $position:
                    screenName: ${screen.screenName}
                    location: ${screen.location}
                """.trimIndent())
                
                root.setOnClickListener { 
                    Log.d("SCREEN_CLICK", "Selected screen: ${screen.screenName}")
                    onScreenSelected(screen) 
                }
            }
        }

        override fun getItemCount() = screens.size
    }

    private fun onScreenSelected(screen: Screen) {
        Log.d("SCREEN_SELECTION", "Selected screen: ${screen.screenName}")
        
        val intent = Intent(this, PlayerActivity::class.java).apply {
            putExtra("SCREEN_ID", screen.id)
            putExtra("SCREEN_NAME", screen.screenName)
        }
        startActivity(intent)
    }
} 