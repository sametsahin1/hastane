package com.example.hospitalscreenmanagement.ui.screens

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.isVisible
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.hospitalscreenmanagement.data.api.RetrofitClient
import com.example.hospitalscreenmanagement.data.api.ApiService
import com.example.hospitalscreenmanagement.data.model.Screen
import com.example.hospitalscreenmanagement.databinding.ActivityScreenSelectionBinding
import com.example.hospitalscreenmanagement.ui.PlayerActivity
import kotlinx.coroutines.launch

class ScreenSelectionActivity : AppCompatActivity() {
    private lateinit var binding: ActivityScreenSelectionBinding
    private val screenAdapter = ScreenAdapter { screen ->
        navigateToPlayer(screen.id)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityScreenSelectionBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupRecyclerView()
        loadScreens()
    }

    private fun setupRecyclerView() {
        binding.recyclerViewScreens.apply {
            layoutManager = LinearLayoutManager(this@ScreenSelectionActivity)
            adapter = screenAdapter
        }
    }

    private fun loadScreens() {
        lifecycleScope.launch {
            try {
                binding.progressBar.isVisible = true
                Log.d("API", "Requesting screens from: ${ApiService.BASE_URL}")
                val response = RetrofitClient.apiService.getScreens()
                Log.d("API", "Response: $response")
                if (response.isSuccessful) {
                    response.body()?.let { screens ->
                        Log.d("API", "Received screens: $screens")
                        screenAdapter.submitList(screens)
                    }
                } else {
                    Log.e("API", "Error: ${response.errorBody()?.string()}")
                    showError("Ekranlar yüklenirken hata oluştu: ${response.code()}")
                }
            } catch (e: Exception) {
                Log.e("API", "Exception: ${e.message}", e)
                showError("Bağlantı hatası: ${e.message}")
            } finally {
                binding.progressBar.isVisible = false
            }
        }
    }

    private fun navigateToPlayer(screenId: String) {
        val intent = Intent(this, PlayerActivity::class.java).apply {
            putExtra("SCREEN_ID", screenId)
        }
        startActivity(intent)
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }
} 