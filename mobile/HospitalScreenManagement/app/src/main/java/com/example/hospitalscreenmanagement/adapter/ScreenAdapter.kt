package com.example.hospitalscreenmanagement.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.hospitalscreenmanagement.data.model.Screen
import com.example.hospitalscreenmanagement.databinding.ItemScreenBinding

class ScreenAdapter(
    private val screens: List<Screen>,
    private val onScreenClick: (String) -> Unit
) : RecyclerView.Adapter<ScreenAdapter.ScreenViewHolder>() {

    inner class ScreenViewHolder(private val binding: ItemScreenBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(screen: Screen) {
            binding.apply {
                tvScreenName.text = screen.name
                tvLocation.text = screen.location
                tvStatus.text = screen.status

                root.setOnClickListener {
                    onScreenClick(screen.id)
                }
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ScreenViewHolder {
        val binding = ItemScreenBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return ScreenViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ScreenViewHolder, position: Int) {
        holder.bind(screens[position])
    }

    override fun getItemCount() = screens.size
} 