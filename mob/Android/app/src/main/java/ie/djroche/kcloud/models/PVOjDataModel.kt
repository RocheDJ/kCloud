package ie.djroche.kcloud.models
import android.os.Parcelable
import kotlinx.parcelize.Parcelize
@Parcelize
data class PVOjDataModel(
    var unit   :   String  =   "",
    var title   :   String  =   "",
    var value   :   String  =   "",
    var valueType  :   Int  =   5
): Parcelable