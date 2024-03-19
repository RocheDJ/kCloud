package ie.djroche.kcloud.models
import android.os.Parcelable

import kotlinx.parcelize.Parcelize
import java.util.UUID

@Parcelize
data class InstallationModel(
    var id              : String = "",
    var userid          : UInt   = 0u,
    var description     : String = "",
    var type            : String = "",

    var updated         : Int    = 0,
    var qrcode          : String = UUID.randomUUID().toString(),
    var modelVersion    : Int    = 1,
    var data            : MutableList<PVOModel> = mutableListOf<PVOModel>()
): Parcelable
{

    fun toMap(): Map<String, Any?> {
        return mapOf(
            "uid" to id,
            "qrcode" to qrcode,
            "description" to description,
            "updated" to updated,
            "modelVersion" to modelVersion,
            "userid" to userid,
            "data" to data
        )
    }
}