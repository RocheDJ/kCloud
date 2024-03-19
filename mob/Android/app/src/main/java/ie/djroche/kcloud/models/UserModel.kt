
package ie.djroche.kcloud.models
import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class UserModel (
   // var uid          :   String? = UUID.randomUUID().toString(), // allow id to be nullable receiver
    var id          :   UInt=0u,
    var firstName   :   String="",
    var lastName    :   String="",
    var email       :   String="",
    var password    :   String="",
    var mobile      :   String="",
    var role        :   Int= 0,

): Parcelable