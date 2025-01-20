package com.example.hospitalscreenmanagement.data.model

data class ScreenConfig(
    val _id: String,
    val screenId: String,
    val playlist: Playlist,
    val refreshInterval: Int = 5000,
    val transitionEffect: String = "fade"
) 