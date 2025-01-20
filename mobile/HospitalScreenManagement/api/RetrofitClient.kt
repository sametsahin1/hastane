object RetrofitClient {
    private const val BASE_URL = "https://yazilimservisi.com/" // localhost yerine 10.0.2.2 kullanın

    private val gson = GsonBuilder()
        .setLenient()
        .create()

    private val retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .addConverterFactory(GsonConverterFactory.create(gson))
        .build()

    val api: ApiService = retrofit.create(ApiService::class.java)
} 