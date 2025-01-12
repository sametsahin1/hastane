package com.example.hospitalscreenmanagement.api

import com.google.gson.annotations.SerializedName

data class Screen(
    @SerializedName("_id") val id: String,
    @SerializedName("screenName") val name: String,
    @SerializedName("location") val location: String? = null,
    @SerializedName("isActive") val isActive: Boolean = true
)

data class ScreenConfig(
    @SerializedName("id") val id: String,
    @SerializedName("name") val name: String,
    @SerializedName("playlist") val playlist: Playlist?
)

data class Playlist(
    @SerializedName("id") val id: String,
    @SerializedName("name") val name: String,
    @SerializedName("mediaItems") val mediaItems: List<MediaItem>
)

data class MediaItem(
    @SerializedName("id") val id: String,
    @SerializedName("mediaType") val mediaType: String,
    @SerializedName("filePath") val filePath: String,
    @SerializedName("duration") val duration: Int
) 