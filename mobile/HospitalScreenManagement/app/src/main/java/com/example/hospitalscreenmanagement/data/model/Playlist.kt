package com.example.hospitalscreenmanagement.data.model

import com.example.hospitalscreenmanagement.data.model.MediaItemInfo
import com.google.gson.annotations.SerializedName

data class Playlist(
    @SerializedName("_id") val id: String,
    val name: String,
    val mediaItems: List<MediaItemInfo>,
    val createdAt: String,
    val updatedAt: String,
    @SerializedName("__v") val version: Int
) {
    // getAllMediaItems() fonksiyonuna artık gerek yok çünkü mediaItems direkt olarak doğru formatta
    fun getAllMediaItems(): List<MediaItemInfo> = mediaItems
} 