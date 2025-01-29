package com.example.hospitalscreenmanagement.data.model

import com.google.gson.annotations.SerializedName

data class MediaItemInfo(
    @SerializedName("_id") val id: String,
    val media: Media?,
    val duration: Int
)

data class Media(
    @SerializedName("_id") val id: String,
    val name: String,
    val mediaType: String,
    val filePath: String,
    val duration: Int,
    val createdAt: String? = null,
    val updatedAt: String? = null,
    @SerializedName("__v") val version: Int = 0
) 