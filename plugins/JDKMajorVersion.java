/**
 * https://github.com/atmulyana/expressCartMobile
 */
public class JDKMajorVersion {
    public static void main(String[] args){
		String version = System.getProperty("java.version");
        String[] versionPart = version.split("\\.", 3);
        int ver1 = Integer.parseInt(versionPart[0]),
            ver2 = Integer.parseInt(versionPart[1]);
        int majorVer = ver1 == 1 ? ver2 : ver1;
        System.out.print(majorVer);
	}
}