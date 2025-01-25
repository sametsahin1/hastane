package com.example.hospitalscreenmanagement.ui.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.hospitalscreenmanagement.data.model.Screen
import com.example.hospitalscreenmanagement.databinding.ItemScreenBinding

class ScreenAdapter(
    private var screens: List<Screen>,
    private val onItemClick: (Screen) -> Unit
) : RecyclerView.Adapter<ScreenAdapter.ScreenViewHolder>() {

    inner class ScreenViewHolder(private val binding: ItemScreenBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(screen: Screen) {
            binding.apply {
                textViewScreenName.text = screen.name
                textViewScreenLocation.text = if (screen.location.isNullOrEmpty()) "Konum belirtilmemiş" else screen.location
                textViewScreenStatus.text = screen.status
                
                root.setOnClickListener {
                    onItemClick(screen)
                }
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ScreenViewHolder {
        val binding = ItemScreenBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ScreenViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ScreenViewHolder, position: Int) {
        holder.bind(screens[position])
    }

    override fun getItemCount() = screens.size

    fun updateScreens(newScreens: List<Screen>) {
        screens = newScreens
        notifyDataSetChanged()
    }
} 