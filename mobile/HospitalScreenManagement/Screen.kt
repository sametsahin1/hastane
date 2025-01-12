data class Screen(
    @SerializedName("id") val id: String,
    @SerializedName("name") val name: String = "İsimsiz Ekran",
    @SerializedName("location") val location: String? = null,
    @SerializedName("status") val status: String = "inactive"
) 