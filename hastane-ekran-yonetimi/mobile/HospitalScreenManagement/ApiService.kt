interface ApiService {
    @GET("screens")
    fun getScreens(): Call<List<Screen>>
    
    @GET("screens/{id}")
    fun getScreen(@Path("id") screenId: String): Call<Screen>
} 