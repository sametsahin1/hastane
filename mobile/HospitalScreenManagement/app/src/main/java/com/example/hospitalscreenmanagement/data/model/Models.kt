package com.example.hospitalscreenmanagement.data.model

data class Screen(
    val _id: String,
    val name: String,
    val location: String?,
    val status: String,
    val currentPlaylist: String?
)

data class ScreenDetail(
    val _id: String,
    val name: String,
    val currentPlaylist: Playlist?
)

data class Playlist(
    val _id: String,
    val name: String,
    val mediaItems: List<MediaItem>
)

data class MediaItem(
    val media: Media,
    val duration: Int
)

data class Media(
    val _id: String,
    val name: String,
    val mediaType: String,
    val filePath: String
)

data class ScreenConfig(
    val screen: ScreenInfo,
    val playlist: PlaylistInfo
)

data class ScreenInfo(
    val id: String,
    val name: String,
    val status: String
)

data class PlaylistInfo(
    val id: String,
    val name: String,
    val mediaItems: List<MediaItemInfo>
)

data class MediaItemInfo(
    val id: String,
    val mediaType: String,
    val filePath: String,
    val duration: Int,
    val name: String
) 