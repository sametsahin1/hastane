package com.example.hospitalscreenmanagement.ui.screens

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.hospitalscreenmanagement.data.model.Screen
import com.example.hospitalscreenmanagement.databinding.ItemScreenBinding

class ScreenAdapter(private val onScreenClick: (Screen) -> Unit) :
    ListAdapter<Screen, ScreenAdapter.ScreenViewHolder>(ScreenDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ScreenViewHolder {
        val binding = ItemScreenBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return ScreenViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ScreenViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class ScreenViewHolder(private val binding: ItemScreenBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(screen: Screen) {
            binding.textViewScreenName.text = screen.name
            binding.textViewScreenLocation.text = screen.location
            binding.root.setOnClickListener { onScreenClick(screen) }
        }
    }
}

class ScreenDiffCallback : DiffUtil.ItemCallback<Screen>() {
    override fun areItemsTheSame(oldItem: Screen, newItem: Screen): Boolean {
        return oldItem.id == newItem.id
    }

    override fun areContentsTheSame(oldItem: Screen, newItem: Screen): Boolean {
        return oldItem == newItem
    }
} 