#include <stdio.h>
#include <string.h>
#include <tchar.h>
#include <windows.h>
#include "j2534_v0404.h"
struct PassThru_RegInfo
{
	char* Name;
	char* FunctionLibrary;
};
struct PassThru_DLLInfo
{
	PTOPEN PassThruOpen;
	PTCLOSE PassThruClose;
	PTCONNECT PassThruConnect;
	PTDISCONNECT PassThruDisconnect;
	PTREADMSGS PassThruReadMsgs;
	PTWRITEMSGS PassThruWriteMsgs;
	PTSTARTPERIODICMSG PassThruStartPeriodicMsg;
	PTSTOPPERIODICMSG PassThruStopPeriodicMsg;
	PTSTARTMSGFILTER PassThruStartMsgFilter;
	PTSTOPMSGFILTER PassThruStopMsgFilter;
	PTSETPROGRAMMINGVOLTAGE PassThruSetProgrammingVoltage;
	PTREADVERSION PassThruReadVersion;
	PTGETLASTERROR PassThruGetLastError;
	PTIOCTL PassThruIoctl;
};
struct PassThru_LibraryList
{
	PassThru_RegInfo* PassThruRegInfo;
	PassThru_DLLInfo* PassThruDLLInfo;
	HMODULE* HModule;
	unsigned long* DeviceID;
	unsigned int Count;
};
	/*获取注册表信息并初始化储存空间*/		/*形参 ErrorMessage保存出错信息*/					/*返回值 注册表项数*/
int WINAPI PassThru_InquiryReg(char* ErrorMessage);

	/*获取索引信息*/						/*形参 Index设备索引*/								/*返回值 设备名*/
char* WINAPI PassThru_InquiryIndex(unsigned int Index);

	/*加载动态库*/							/*形参 ErrorMessage保存出错信息*/					/*返回值 成功加载动态库数目*/
int WINAPI PassThru_LoadDLL(char* ErrorMessage);

	/*打开指定设备*/						/*形参 Index设备索引 ErrorMessage保存出错信息*/		/*返回值 0成功 非0失败*/
int WINAPI PassThru_Open(char* ErrorMessage,unsigned int Index);

	/*连接指定设备 获取ChannelID*/			/*形参 ErrorMessage保存出错信息 Index设备索引 pChannelID要保存的ChannelID ProtocolID默认6 Flags默认0 BaudRate默认500000*/		/*返回值 0成功 非0失败*/
int WINAPI PassThru_Connect(char* ErrorMessage,unsigned int Index,unsigned long* pChannelID,unsigned long ProtocolID=ISO15765,unsigned long Flags=0,unsigned long BaudRate=500000);

	/*设备IO配置*/							/*形参 ErrorMessage保存出错信息 Index设备索引 pChannelID连接指定设备后的ChannelID IoctlID默认2*/								/*返回值 0成功 非0失败*/
int WINAPI PassThru_Ioctl(char* ErrorMessage,unsigned int Index,const unsigned long* pChannelID,unsigned long IoctlID=SET_CONFIG);

	/*配置过虑器 获取FilterID*/				/*形参 ErrorMessage保存出错信息 Index设备索引 pChannelID连接指定设备后的ChannelID pFilterID要保存的FilterID FilterType默认3 */	/*返回值 0成功 非0失败*/
int WINAPI PassThru_StartMsgFilter(char* ErrorMessage,unsigned int Index,const unsigned long* pChannelID,unsigned long* pFilterID,unsigned long FilterType=FLOW_CONTROL_FILTER);

	/*发送*/	/*形参 ErrorMessage保存出错信息 Index设备索引 pChannelID连接指定设备后的ChannelID Message要发送的信息 Length发送信息长度 Timeout默认1000 */							/*返回值 0成功 非0失败*/
int WINAPI PassThru_WriteMsgs(char* ErrorMessage,unsigned int Index,const unsigned long* pChannelID,const char* Message,unsigned int* Length,unsigned long Timeout=1000);

	/*接收*/	/*形参 ErrorMessage保存出错信息 Index设备索引 pChannelID连接指定设备后的ChannelID Message要接收的信息 Length接收信息长度 pNumMsgs接收字符串的数量 Timeout默认1000 *//*返回值 0成功 非0失败*/
int WINAPI PassThru_ReadMsgs(char* ErrorMessage,unsigned int Index,const unsigned long* pChannelID,char* Message,unsigned int* Length,unsigned long* pNumMsgs=NULL,unsigned long Timeout=1000);

	/*删除过虑器 取消FilterID*/		/*形参 ErrorMessage保存出错信息 Index设备索引 pChannelID连接指定设备后的ChannelID pFilterID要取消的FilterID*/		/*返回值 0成功 非0失败*/
int WINAPI PassThru_StopMsgFilter(char* ErrorMessage,unsigned int Index,const unsigned long* pChannelID,unsigned long* pFilterID);

	/*断开指定连接 取消ChannelID*/	/*形参 ErrorMessage保存出错信息 Index设备索引 pChannelID要取消的ChannelID*/		/*返回值 0成功 非0失败*/
int WINAPI PassThru_Disconnect(char* ErrorMessage,unsigned int Index,unsigned long* pChannelID);

	/*关闭指定设备*/	/*形参 ErrorMessage保存出错信息 Index设备索引*/					/*返回值 0成功 非0失败*/
int WINAPI PassThru_Close(char* ErrorMessage,unsigned int Index);

	/*释放空间*/		/*形参 无*/											/*返回值 无*/
void WINAPI PassThru_Delete(void);