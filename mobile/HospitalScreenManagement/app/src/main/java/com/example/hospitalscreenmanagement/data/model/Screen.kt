package com.example.hospitalscreenmanagement.data.model

data class Screen(
    val _id: String,
    val name: String,
    val location: String,
    val status: String,
    val createdAt: String,
    val updatedAt: String,
    val currentPlaylist: Playlist? = null,
    val __v: Int = 0
) 