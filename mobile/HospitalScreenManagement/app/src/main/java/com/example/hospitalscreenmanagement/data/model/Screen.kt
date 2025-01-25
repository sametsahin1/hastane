package com.example.hospitalscreenmanagement.data.model

import com.google.gson.annotations.SerializedName

data class Screen(
    @SerializedName("_id") val id: String,
    val name: String,
    val location: String,
    val status: String,
    val currentPlaylist: Playlist?,
    val createdAt: String,
    val updatedAt: String,
    @SerializedName("__v") val version: Int
)

data class MediaItem(
    val _id: String,
    val name: String,
    val mediaType: String,
    val filePath: String,
    val duration: Int = 5
) 