package com.example.hospitalscreenmanagement.data.model

data class ScreenDetail(
    val _id: String,
    val name: String,
    val location: String,
    val status: String,
    val currentPlaylist: Playlist? = null
) 