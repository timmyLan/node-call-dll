#include <stdio.h>
#include <string.h>
#include <tchar.h>
#include <windows.h>
#include "j2534_v0404.h"

#define CheckIndex(Index) if((unsigned int)Index>=PassThruInfoList->Count)\
	{\
		if(ErrorMessage!=NULL)\
			strcpy_s(ErrorMessage,50,"OutsideBounds");\
		return 0X1B;\
	}
#define CheckVariable(Variable) if(Variable==0)\
	{\
		if(ErrorMessage!=NULL)\
			strcpy_s(ErrorMessage,50,"VariableNull");\
		return 0X1C;\
	}
#define CheckReturnValue(ReturnValue) if(ReturnValue!=STATUS_NOERROR)\
	{\
		if(ErrorMessage!=NULL)\
			PassThruInfoList->PassThru_DLLInfo[Index].PassThruGetLastError(ErrorMessage);\
	}
struct PassThru_DLLInfo
{
	char* FunctionLibrary;
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
struct PassThru_RegName
{
	char* Name;
};
struct PassThru_RegInfo
{
	PassThru_RegName* PassThruRegName;
	int Count;
};
struct PassThru_InfoList
{
	PassThru_DLLInfo* PassThru_DLLInfo;
	HMODULE* HModule;
	unsigned long* DeviceID;
	unsigned long* ChannelID;
	unsigned long* pFilterID;
	unsigned long Count;
};
	/*获取注册表信息并初始化储存空间*/		/*形参 Count注册表表项的数目 ErrorMessage保存出错信息*/		/*返回值 注册表信息*/
PassThru_RegInfo* WINAPI PassThru_InquiryReg(char* ErrorMessage);

	/*加载动态库*/			/*形参 ErrorMessage保存出错信息*/		/*返回值 成功加载动态库数目*/
int WINAPI PassThru_LoadDLL(char* ErrorMessage);

	/*打开指定设备*/		/*形参 Index索引 ErrorMessage保存出错信息*/		/*返回值 0成功 非0失败*/
int WINAPI PassThru_Open(char* ErrorMessage,int Index);

	/*连接指定设备*/		/*形参 ErrorMessage保存出错信息 Index索引 ProtocolID默认6 Flags默认0 BaudRate默认500000*/	/*返回值 0成功 非0失败*/
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

	/*关闭指定设备*/			/*形参 ErrorMessage保存出错信息*/				/*返回值 0成功 非0失败*/
int WINAPI PassThru_Close(char* ErrorMessage,int Index);

	/*释放空间*/			/*形参 无*/				/*返回值 无*/
void WINAPI PassThru_Delete(void);