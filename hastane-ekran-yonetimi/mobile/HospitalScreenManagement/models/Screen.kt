data class Screen(
    @SerializedName("_id") val id: String,
    @SerializedName("screenName") val screenName: String = "",
    @SerializedName("location") val location: String? = null,
    @SerializedName("isActive") val isActive: Boolean = true,
    @SerializedName("createdAt") val createdAt: String? = null,
    @SerializedName("__v") val version: Int = 0
) {
    override fun toString(): String {
        return "Screen(id='$id', screenName='$screenName', location=$location, isActive=$isActive)"
    }
} 