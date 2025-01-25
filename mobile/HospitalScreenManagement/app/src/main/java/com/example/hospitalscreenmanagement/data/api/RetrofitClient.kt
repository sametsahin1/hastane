package com.example.hospitalscreenmanagement.data.api

import android.util.Log
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit
import javax.net.ssl.SSLContext
import javax.net.ssl.TrustManager
import javax.net.ssl.X509TrustManager
import java.security.cert.X509Certificate
import com.google.gson.GsonBuilder
import com.google.gson.TypeAdapter
import com.google.gson.stream.JsonReader
import com.google.gson.stream.JsonWriter
import com.example.hospitalscreenmanagement.data.model.Playlist
import com.example.hospitalscreenmanagement.data.model.MediaItemInfo
import com.example.hospitalscreenmanagement.data.model.Media

object RetrofitClient {
    private const val BASE_URL = "https://yazilimservisi.com/"

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
        redactHeader("Authorization")
        redactHeader("Cookie")
    }

    private val trustAllCerts = arrayOf<TrustManager>(object : X509TrustManager {
        override fun checkClientTrusted(chain: Array<out X509Certificate>?, authType: String?) {}
        override fun checkServerTrusted(chain: Array<out X509Certificate>?, authType: String?) {}
        override fun getAcceptedIssuers(): Array<X509Certificate> = arrayOf()
    })

    private val sslContext = SSLContext.getInstance("SSL").apply {
        init(null, trustAllCerts, java.security.SecureRandom())
    }

    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .addInterceptor { chain ->
            val original = chain.request()
            val request = original.newBuilder()
                .header("Accept", "application/json")
                .method(original.method, original.body)
                .build()
            chain.proceed(request)
        }
        .sslSocketFactory(sslContext.socketFactory, trustAllCerts[0] as X509TrustManager)
        .hostnameVerifier { _, _ -> true }
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()

    private val gson = GsonBuilder()
        .setLenient()
        .registerTypeAdapter(Playlist::class.java, object : TypeAdapter<Playlist>() {
            override fun write(out: JsonWriter, value: Playlist?) {
                // Yazma işlemi için gerekirse implement edilebilir
            }

            override fun read(input: JsonReader): Playlist? {
                var id: String? = null
                var name: String? = null
                var createdAt: String? = null
                var updatedAt: String? = null
                var version: Int = 0
                var mediaItems = mutableListOf<MediaItemInfo>()
                
                input.beginObject()
                while (input.hasNext()) {
                    when (input.nextName()) {
                        "_id" -> id = input.nextString()
                        "name" -> name = input.nextString()
                        "mediaItems" -> {
                            input.beginArray()
                            while (input.hasNext()) {
                                input.beginObject()
                                var mediaItemId: String? = null
                                var duration: Int = 0
                                var media: Media? = null
                                
                                while (input.hasNext()) {
                                    when (input.nextName()) {
                                        "_id" -> mediaItemId = input.nextString()
                                        "duration" -> duration = input.nextInt()
                                        "media" -> {
                                            input.beginObject()
                                            var mediaId: String? = null
                                            var mediaName: String? = null
                                            var mediaType: String? = null
                                            var filePath: String? = null
                                            var mediaDuration: Int = 0
                                            
                                            while (input.hasNext()) {
                                                when (input.nextName()) {
                                                    "_id" -> mediaId = input.nextString()
                                                    "name" -> mediaName = input.nextString()
                                                    "mediaType" -> mediaType = input.nextString()
                                                    "filePath" -> filePath = input.nextString()
                                                    "duration" -> mediaDuration = input.nextInt()
                                                    else -> input.skipValue()
                                                }
                                            }
                                            input.endObject()
                                            
                                            if (mediaId != null && mediaName != null && mediaType != null && filePath != null) {
                                                media = Media(mediaId, mediaName, mediaType, filePath, mediaDuration)
                                            }
                                        }
                                        else -> input.skipValue()
                                    }
                                }
                                input.endObject()
                                
                                if (mediaItemId != null && media != null) {
                                    mediaItems.add(MediaItemInfo(mediaItemId, media, duration))
                                }
                            }
                            input.endArray()
                        }
                        "createdAt" -> createdAt = input.nextString()
                        "updatedAt" -> updatedAt = input.nextString()
                        "__v" -> version = input.nextInt()
                        else -> input.skipValue()
                    }
                }
                input.endObject()
                
                return if (id != null && name != null && createdAt != null && updatedAt != null) {
                    Playlist(id, name, mediaItems, createdAt, updatedAt, version)
                } else {
                    null
                }
            }
        })
        .create()

    private val retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create(gson))
        .build()

    val apiService: ApiService = retrofit.create(ApiService::class.java)
} 