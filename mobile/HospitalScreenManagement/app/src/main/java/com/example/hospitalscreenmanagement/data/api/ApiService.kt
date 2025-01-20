package com.example.hospitalscreenmanagement.data.api

import com.example.hospitalscreenmanagement.data.model.*
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Headers
import retrofit2.http.Path

interface ApiService {
    companion object {
        const val BASE_URL = "https://yazilimservisi.com/"  // HTTPS'e geri dönüyoruz
    }

    @Headers("Accept: application/json")
    @GET("api/screens")
    suspend fun getScreens(): Response<List<Screen>>

    @Headers("Accept: application/json")
    @GET("api/screens/{screenId}")
    suspend fun getScreenDetails(@Path("screenId") screenId: String): Response<ScreenDetail>

    @Headers("Accept: application/json")
    @GET("api/screens/{screenId}/config")
    suspend fun getScreenConfig(@Path("screenId") screenId: String): Response<ScreenConfig>

    @Headers("Accept: application/json")
    @GET("api/playlists/{playlistId}/media")
    suspend fun getPlaylistMedia(@Path("playlistId") playlistId: String): Response<List<MediaItemInfo>>
} 