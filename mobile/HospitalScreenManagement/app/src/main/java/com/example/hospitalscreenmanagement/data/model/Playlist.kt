package com.example.hospitalscreenmanagement.data.model

import com.example.hospitalscreenmanagement.data.model.MediaItemInfo
import com.google.gson.annotations.SerializedName

data class Playlist(
    @SerializedName("_id") val id: String,
    val name: String,
    val mediaItems: List<MediaItemInfo> = emptyList(),
    val createdAt: String? = null,
    val updatedAt: String? = null,
    @SerializedName("__v") val version: Int = 0
) {
    // getAllMediaItems() fonksiyonuna artık gerek yok çünkü mediaItems direkt olarak doğru formatta
    fun getAllMediaItems(): List<MediaItemInfo> = mediaItems
} 