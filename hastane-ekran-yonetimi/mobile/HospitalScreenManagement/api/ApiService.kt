interface ApiService {
    @GET("screens")
    suspend fun getScreens(): Response<List<Screen>>

    @GET("screens/{id}")
    suspend fun getScreen(@Path("id") id: String): Response<Screen>
} 