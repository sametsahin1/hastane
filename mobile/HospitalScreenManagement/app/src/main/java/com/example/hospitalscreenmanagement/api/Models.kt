package com.example.hospitalscreenmanagement.api

import com.google.gson.annotations.SerializedName

data class Screen(
    @SerializedName("_id") val id: String,
    @SerializedName("name") val name: String,
    @SerializedName("location") val location: String?,
    @SerializedName("status") val status: String,
    @SerializedName("currentPlaylist") val currentPlaylist: CurrentPlaylist?
)

data class CurrentPlaylist(
    @SerializedName("_id") val id: String,
    @SerializedName("name") val name: String
)

data class ScreenConfig(
    @SerializedName("screen") val screen: ScreenInfo,
    @SerializedName("playlist") val playlist: PlaylistConfig
)

data class ScreenInfo(
    @SerializedName("id") val id: String,
    @SerializedName("name") val name: String,
    @SerializedName("location") val location: String,
    @SerializedName("status") val status: String
)

data class PlaylistConfig(
    @SerializedName("id") val id: String,
    @SerializedName("name") val name: String,
    @SerializedName("mediaItems") val mediaItems: List<MediaItem>
)

data class MediaItem(
    @SerializedName("id") val id: String,
    @SerializedName("mediaType") val mediaType: String,
    @SerializedName("filePath") val filePath: String,
    @SerializedName("duration") val duration: Int,
    @SerializedName("name") val name: String
) 