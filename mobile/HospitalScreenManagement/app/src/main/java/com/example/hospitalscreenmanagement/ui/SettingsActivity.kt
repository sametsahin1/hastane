package com.example.hospitalscreenmanagement.ui

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.Spinner
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.hospitalscreenmanagement.R
import com.example.hospitalscreenmanagement.api.ApiService
import com.example.hospitalscreenmanagement.api.Screen
import com.example.hospitalscreenmanagement.api.ApiClient
import kotlinx.coroutines.launch
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class SettingsActivity : AppCompatActivity() {
    private lateinit var spinnerScreens: Spinner
    private lateinit var btnNext: Button
    private lateinit var apiService: ApiService
    private var screenList = mutableListOf<Screen>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings)

        spinnerScreens = findViewById(R.id.spinnerScreens)
        btnNext = findViewById(R.id.btnNext)

        setupInitialSpinner()
        setupRetrofit()
        loadScreens()

        btnNext.setOnClickListener {
            val selectedPosition = spinnerScreens.selectedItemPosition
            if (selectedPosition >= 0 && selectedPosition < screenList.size) {
                val selectedScreen = screenList[selectedPosition]
                startPlayerActivity(selectedScreen.id)
            } else {
                showMessage("Lütfen bir ekran seçin")
            }
        }
    }

    private fun setupInitialSpinner() {
        val initialList = listOf("Yükleniyor...")
        val adapter = createSpinnerAdapter(initialList)
        spinnerScreens.adapter = adapter
    }

    private fun createSpinnerAdapter(items: List<String>): ArrayAdapter<String> {
        return ArrayAdapter(
            this,
            android.R.layout.simple_spinner_item,
            items.map { it ?: "Bilinmeyen" } // null değerleri güvenli hale getir
        ).apply {
            setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        }
    }

    private fun startPlayerActivity(screenId: String) {
        val intent = Intent(this, PlayerActivity::class.java).apply {
            putExtra("SCREEN_ID", screenId)
        }
        startActivity(intent)
    }

    private fun showMessage(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun setupRetrofit() {
        apiService = ApiClient.api
    }

    private fun loadScreens() {
        lifecycleScope.launch {
            try {
                val screens = apiService.getScreens()
                screenList.clear()
                screenList.addAll(screens)

                val screenNames = if (screens.isEmpty()) {
                    listOf("Ekran bulunamadı")
                } else {
                    screens.mapNotNull { it.name ?: "İsimsiz Ekran" }
                }

                runOnUiThread {
                    spinnerScreens.adapter = createSpinnerAdapter(screenNames)
                }
            } catch (e: Exception) {
                val errorMessage = "Ekranlar yüklenirken hata: ${e.message}"
                Log.e("SettingsActivity", errorMessage, e)
                runOnUiThread {
                    spinnerScreens.adapter = createSpinnerAdapter(listOf(errorMessage))
                    showMessage(errorMessage)
                }
            }
        }
    }
} 