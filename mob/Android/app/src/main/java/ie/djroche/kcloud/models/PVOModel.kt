package ie.djroche.kcloud.models
import android.os.Parcelable
import kotlinx.parcelize.Parcelize

private val defaultImage = "industry40.png";
//Data Model to hold Key Performance Indicators
@Parcelize
data class PVOModel(
    var id              :   Int     =   0,
    var title           :   String  =   "",
    var value           :   Double  =   0.0,
    val unit            :   String  =   "-",
    var installationid  :   UInt = 0U,
    var nodeid          :   Int = 0,
    var portid          :   Int = 0,
    var EventDate       :   String= "",
    var jData           :   PVOjDataModel = PVOjDataModel(),
    var icon    :   String     =   defaultImage
): Parcelable
