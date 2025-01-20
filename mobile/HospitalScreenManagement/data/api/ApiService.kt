import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Path

interface ApiService {
    companion object {
        const val BASE_URL = "https://yazilimservisi.com/api/"
    }

    @GET("screens")
    suspend fun getScreens(): Response<List<Screen>>

    @GET("screens/{screenId}")
    suspend fun getScreenDetails(@Path("screenId") screenId: String): Response<ScreenDetail>

    @GET("screens/{screenId}/config")
    suspend fun getScreenConfig(@Path("screenId") screenId: String): Response<ScreenConfig>
} 