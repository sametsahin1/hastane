package com.example.hospitalscreenmanagement.api

import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.Response

interface ApiService {
    @GET("screens")
    suspend fun getScreens(): Response<List<Screen>>
    
    @GET("screens/{screenId}/config")
    suspend fun getScreenConfig(@Path("screenId") screenId: String): ScreenConfig
} 