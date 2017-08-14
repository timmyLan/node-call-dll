#include <stdio.h>
#include <string.h>
#include <tchar.h>
#include <windows.h>
#include "j2534_v0404.h"
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
struct PassThru_RegInfo
{
	unsigned char* Name;
	unsigned char* FunctionLibrary;
};
struct PassThru_InfoList
{
	PassThru_RegInfo* PassThru_RegInfo;
	PassThru_DLLInfo* PassThru_DLLInfo;
	HMODULE* HModule;
	unsigned long* DeviceID;
	unsigned long* ChannelID;
	unsigned long* pFilterID;
	unsigned long Count;
};
	/*获取注册表信息*/		/*形参 ErrorMessage保存出错信息*/		/*返回值 注册表表项的数目*/
int WINAPI PassThru_InquiryReg(char* ErrorMessage);
	/*加载动态库*/			/*形参 ErrorMessage保存出错信息*/		/*返回值 成功加载动态库数目*/
int WINAPI PassThru_LoadDLL(char* ErrorMessage);
	/*查询索引*/			/*形参 Index索引 IndexName保存索引名*/	/*返回值 true索引可用 false索引不可用*/
bool WINAPI PassThru_InquiryIndex(int Index,char* IndexName);
	/*检测设备数量*/		/*形参 ErrorMessage保存出错信息*/		/*返回值 已连接设备数量*/
int WINAPI PassThru_Open(char* ErrorMessage);
	/*连接指定设备*/		/*形参 ErrorMessage保存出错信息 Index索引 ProtocolID默认6 Flags默认0 BaudRate默认500000*/						/*返回值 0成功 非0失败*/
int WINAPI PassThru_Connect(char* ErrorMessage,int Index,unsigned long ProtocolID=ISO15765,unsigned long Flags=0,unsigned long BaudRate=500000);
	/*设备IO配置*/			/*形参 ErrorMessage保存出错信息 Index索引 IoctlID默认2*/														/*返回值 0成功 非0失败*/
int WINAPI PassThru_Ioctl(char* ErrorMessage,int Index,unsigned long IoctlID=SET_CONFIG);
	/*配置过虑器*/			/*形参 ErrorMessage保存出错信息 Index索引 FilterType默认3 */													/*返回值 0成功 非0失败*/
int WINAPI PassThru_StartMsgFilter(char* ErrorMessage,int Index,unsigned long FilterType=FLOW_CONTROL_FILTER);
	/*发送*/				/*形参 ErrorMessage保存出错信息 Index索引 Message要发送的字符串 Timeout默认1000 */								/*返回值 0成功 非0失败*/
int WINAPI PassThru_WriteMsgs(char* ErrorMessage,int Index,char* Message,unsigned long Timeout=1000);
	/*接收*/				/*形参 ErrorMessage保存出错信息 Index索引 Message要接收的字符串 pNumMsgs接收字符串的数量 Timeout默认1000 */		/*返回值 0成功 非0失败*/
int WINAPI PassThru_ReadMsgs(char* ErrorMessage,int Index,char* Message,unsigned long* pNumMsgs=NULL,unsigned long Timeout=1000);
	/*删除过虑器*/			/*形参 ErrorMessage保存出错信息 Index索引*/		/*返回值 0成功 非0失败*/
int WINAPI PassThru_StopMsgFilter(char* ErrorMessage,int Index);
	/*断开指定连接*/		/*形参 ErrorMessage保存出错信息 Index索引*/		/*返回值 0成功 非0失败*/
int WINAPI PassThru_Disconnect(char* ErrorMessage,int Index);
	/*关闭设备*/			/*形参 ErrorMessage保存出错信息*/				/*返回值 关闭设备数量*/
int WINAPI PassThru_Close(char* ErrorMessage);