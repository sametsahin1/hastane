package com.example.hospitalscreenmanagement.data.model

import com.example.hospitalscreenmanagement.data.model.MediaItemInfo

data class Playlist(
    val _id: String,
    val name: String,
    val mediaItems: List<MediaItemInfo> = emptyList()  // Default değer olarak boş liste
) 