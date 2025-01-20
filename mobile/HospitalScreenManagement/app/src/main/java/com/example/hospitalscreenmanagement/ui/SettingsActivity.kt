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
import com.example.hospitalscreenmanagement.data.api.ApiService
import com.example.hospitalscreenmanagement.data.api.RetrofitClient
import com.example.hospitalscreenmanagement.data.model.Screen
import kotlinx.coroutines.launch

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
        apiService = RetrofitClient.apiService
    }

    private fun loadScreens() {
        lifecycleScope.launch {
            try {
                val response = apiService.getScreens()
                if (response.isSuccessful) {
                    val screens = response.body()
                    if (screens != null) {
                        screenList.clear()
                        screenList.addAll(screens)
                        
                        val screenNames = screenList.map { it.name }
                        if (screenNames.isNotEmpty()) {
                            setupSpinner(screenNames)
                        } else {
                            Toast.makeText(this@SettingsActivity, "Ekran listesi boş", Toast.LENGTH_SHORT).show()
                        }
                    }
                } else {
                    Toast.makeText(this@SettingsActivity, "Veri alınamadı: ${response.message()}", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@SettingsActivity, "Hata: ${e.message}", Toast.LENGTH_SHORT).show()
                Log.e("SettingsActivity", "Hata:", e)
            }
        }
    }

    private fun setupSpinner(screenNames: List<String>) {
        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, screenNames)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        spinnerScreens.adapter = adapter
    }
} 