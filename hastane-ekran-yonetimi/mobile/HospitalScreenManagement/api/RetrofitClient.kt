object RetrofitClient {
    private const val BASE_URL = "http://10.0.2.2:3000/" // localhost yerine 10.0.2.2 kullanın

    private val gson = GsonBuilder()
        .setLenient()
        .create()

    private val retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .addConverterFactory(GsonConverterFactory.create(gson))
        .build()

    val api: ApiService = retrofit.create(ApiService::class.java)
} 