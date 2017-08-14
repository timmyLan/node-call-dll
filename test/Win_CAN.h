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
unsigned char WINAPI PassThru_InquiryReg(char* ErrorMessage);
unsigned char WINAPI PassThru_LoadDLL(char* ErrorMessage);
unsigned char WINAPI PassThru_Open(char* ErrorMessage);
bool WINAPI PassThru_Connect(char* ErrorMessage,unsigned char Index,unsigned long ProtocolID=ISO15765,unsigned long Flags=0,unsigned long BaudRate=500000);
//bool WINAPI PassThru_Ioctl(PassThru_InfoList* PassThru_InfoList,unsigned char Index,unsigned long IoctlID=SET_CONFIG,SCONFIG_LIST *pInput=NULL,SCONFIG_LIST *pOutput=NULL);
//bool WINAPI PassThru_StartMsgFilter(PassThru_InfoList* PassThru_InfoList,unsigned char Index,PASSTHRU_MSG *pMaskMsg=NULL,PASSTHRU_MSG *pPatternMsg=NULL,PASSTHRU_MSG *pFlowControlMsg=NULL,unsigned long FilterType=FLOW_CONTROL_FILTER);
//bool WINAPI PassThru_WriteMsgs(PassThru_InfoList* PassThru_InfoList,char** ErrorMessage,unsigned char Index,unsigned char* Message,unsigned long* pNumMsgs=NULL,unsigned long Timeout=1000);
//bool WINAPI PassThru_ReadMsgs(PassThru_InfoList* PassThru_InfoList,char** ErrorMessage,unsigned char Index,unsigned char** Message,unsigned long* pNumMsgs=NULL,unsigned long Timeout=1000);
//bool WINAPI PassThru_StopMsgFilter(PassThru_InfoList* PassThru_InfoList,unsigned char Index);
//bool WINAPI PassThru_Disconnect(PassThru_InfoList* PassThru_InfoList,unsigned char Index);
//void WINAPI PassThru_UnLoadDLL(PassThru_InfoList* PassThru_InfoList);
//void WINAPI PassThru_Close(PassThru_InfoList* PassThru_InfoList);