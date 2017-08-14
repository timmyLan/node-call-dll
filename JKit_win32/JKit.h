/*
 * Copyright: 
 * File name: JKit.h
 * Description: ���PassThru API�ӿڹ��ϲ�Ӧ��ʹ��
 * Author: huarun.lin
 * Version: 1.0
 * Date: 
 * History: 
 *		huarun.lin        96/10/12      1.0            build this moudle 
 */

#ifndef _JKit_H_
#define _JKit_H_

#include <stdio.h>
#include <windows.h>
#include "j2534_v0404.h"

#ifdef _WIN32
	#define JKIT_API __stdcall
#else
	#define JKIT_API
#endif

typedef unsigned long JK_RetVal;
typedef unsigned int  JK_PassThruLibraryIndexType;


#ifdef __cplusplus
extern "C" {
#endif
/*
 * Function: JK_Initial
 * Description: 
 *		���ʼ���������������£�
 *      ��ϵͳע����������PassThru API �ӿڿ�
 *      ��ʼ�����ȫ�ֻ���
 * Parameter:
 *		NULL
 * Return: 
 *		PassThru API �ӿڿ����
 * Others: 
 *		NULL
 */
JK_RetVal JKIT_API JK_Initial(void);


/*
 * Function: JK_DeInitial
 * Description: 
 *		����ʼ������
 * Parameter:
 *		NULL
 * Return: 
 *		NULL
 * Others: 
 *		NULL
 */
JK_RetVal JKIT_API JK_DeInitial(void);

/*
 * Function: JK_PassThruLibraryCount
 * Description: 
 *		��ȡ PassThru Library ����
 * Parameter:
 *		NULL
 * Return: 
 *		NULL
 * Others: 
 *		NULL
 */
JK_PassThruLibraryIndexType JKIT_API JK_PassThruLibraryCount();

/*
 * Function: JK_GetPassThruLibraryName
 * Description: 
 *		��ȡ PassThru Library Name
 * Parameter:
 *		NULL
 * Return: 
 *		NULL
 * Others: 
 *		NULL
 */
const char* JKIT_API JK_GetPassThruLibraryName(JK_PassThruLibraryIndexType index);

/*
 * Function: JK_GetPassThruLibraryVendor
 * Description: 
 *		��ȡ JK_GetPassThruLibraryVendor
 * Parameter:
 *		NULL
 * Return: 
 *		NULL
 * Others: 
 *		NULL
 */
const char* JKIT_API JK_GetPassThruLibraryVendor(JK_PassThruLibraryIndexType index);

/*
 * Function: JK_GetPassThruLibraryPath
 * Description: 
 *		��ȡ JK_GetPassThru Library Path
 * Parameter:
 *		NULL
 * Return: 
 *		NULL
 * Others: 
 *		NULL
 */
const char* JKIT_API JK_GetPassThruLibraryPath(JK_PassThruLibraryIndexType index);

/*
 * Function: JK_Retval2Str
 * Description: 
 *		��PassThru API �ӿڷ���ֵ ת���������������
 * Parameter:
 *		[in]    RetVal  PassThru API����ֵ
 * Return: 
 *		RetVal�����������
 * Others: 
 *		NULL
 */
char* JK_Retval2Str(unsigned long RetVal);

/*
 * Function: JK_PassThruLoadLibrary
 * Description: 
 *		����PassThru API�豸�ӿڿ�
 * Parameter:
 *		[in]     cFunctionLibrary   PassThru API�豸�ӿڿ�Ŀ¼
 *      [out]    ErrMsg             ���������Ϣ
 * Return: 
 *      NULL     ����PassThru libraryʧ��
 *      !NULL    PassThru library���
 * Others: 
 *		��ش��������ο�#j2534_v0404.hͷ�ļ�
 */
JK_RetVal JKIT_API JK_PassThruLoadLibrary(JK_PassThruLibraryIndexType index, char *ErrMsg = NULL);


/*
 * Function: JK_PassThruLoadLibrary
 * Description: 
 *		ж��PassThru API�豸�ӿڿ�
 * Parameter:
 *      [in]    h	      �ӿھ��     
 *      [out]   ErrMsg    ���������Ϣ
 * Return: 
 *      NULL
 * Others: 
 *      ERR_NULL_PARAMETER     ����Ϊ��
 *		STATUS_NOERROR         �ɹ�
 
 */
 JK_RetVal JKIT_API JK_PassThruUnLoadLibrary(JK_PassThruLibraryIndexType index, char *ErrMsg = NULL);


/*
 * Function: JK_PassThruOpen
 * Description: 
 *		�� szLibPath ���PassThru�豸����
 * Parameter:
 *      [in]     pDLL	     Ҫ�򿪵��豸���PassThru Library
 *      [out]    handle      �򿪳ɹ��󷵻ص�JKit Handle
 *      [out]    ErrMsg      ���������Ϣ
 * Return: 
 *      ERR_NULL_PARAMETER     ����Ϊ��
 *		STATUS_NOERROR         �ɹ�
 *      ERR_FAILED		       �⻹û���ػ��߼���ʧ��
 * Others: 
 *		��ش��������ο�#j2534_v0404.hͷ�ļ�
 */
 //long JKIT_API JK_PassThruOpen(JKit_PassThru_DLL *pDLL, JKitHandle **handle, char *ErrMsg = NULL);


/*
 * Function: JK_PassThruClose
 * Description: 
 *		�ر�PassThru�豸����
 * Parameter:
 *      [in]     h	        �ӿھ��  
 *      [out]    ErrMsg      ���������Ϣ
 * Return: 
 *      ERR_NULL_PARAMETER     ����Ϊ��
 *		STATUS_NOERROR         �ɹ�
 *      ERR_FAILED		       �⻹û���ػ��߼���ʧ��
 * Others: 
 *		��ش��������ο�#j2534_v0404.hͷ�ļ�
 */
 //long JKIT_API JK_PassThruClose(JKitHandle *handle, char *ErrMsg = NULL);

/*
 * Function: JK_PassThruConnect
 * Description: 
 *		�����豸����
 * Parameter:
 *      [in,out] handle          �ӿھ��  
 *      [in]     ProtocolID      �豸ʹ��Э��ID
 *      [in]     Flags           �豸ʹ��Flags
 *      [in]     Baudrate        �豸ʹ�ò�����
 *      [out]    ErrMsg          ���������Ϣ
 * Return: 
 *      ERR_NULL_PARAMETER     ����Ϊ��
 *		STATUS_NOERROR         �ɹ�
 *      ERR_FAILED		       �⻹û���ػ��߼���ʧ��
 * Others: 
 *		��ش��������ο�#j2534_v0404.hͷ�ļ�
 */
//long JKIT_API JK_PassThruConnect(JKitHandle *handle, unsigned long ProtocolID, unsigned long Flags, 
//										unsigned long Baudrate, char *ErrMsg = NULL);

/*
 * Function: JK_PassThruDisconnect
 * Description: 
 *		�Ͽ��豸����ͨ������
 * Parameter:
 *      [in]    handle          �ӿھ��  
 *      [out]   ErrMsg          ���������Ϣ
 * Return: 
 *      ERR_NULL_PARAMETER     ����Ϊ��
 *		STATUS_NOERROR         �ɹ�
 *      ERR_FAILED		       �⻹û���ػ��߼���ʧ��
 * Others: 
 *		��ش��������ο�#j2534_v0404.hͷ�ļ�
 */
// long JKIT_API JK_PassThruDisconnect(JKitHandle *handle, char *ErrMsg = NULL);

/*
 * Function: JK_PassThruReadMsgs
 * Description: 
 *		���豸��ȡ��Ϣ����
 * Parameter:
 *      [in]     handle          �ӿھ��  
 *      [in]     pMsg            Pointer to message structure. 
 *      [in,out] pNumMsgs        Pointer to location where number of messages to read is specified. On return from the 
 *								 function this location will contain the actual number of messages read. 
 *      [in]     Timeout         Read timeout (in milliseconds). If a value of0 is specified the function retrieves up to 
 *                               pNumMsgs messages and returns immediately. Otherwise, the API will not return until 
 *                               the Timeout has expired, an error has occurred, or the desired number of messages 
 *                               have been read. If the number of messagesrequested have been read, the function 
 *                               shall not return ERR_TIMEOUT, even if the timeout value is zero. 
 *		[out]    ErrMsg          ���������Ϣ
 * Return: 
 *      ERR_NULL_PARAMETER     ����Ϊ��
 *		STATUS_NOERROR         �ɹ�
 *      ERR_FAILED		       �⻹û���ػ��߼���ʧ��
 * Others: 
 *		��ش��������ο�#j2534_v0404.hͷ�ļ�
 */
// long JKIT_API JK_PassThruReadMsgs(JKitHandle *handle, PASSTHRU_MSG *pMsg, unsigned long *pNumMsgs,
//											unsigned long Timeout, char *ErrMsg = NULL);


/*
 * Function: JK_PassThruWriteMsgs
 * Description: 
 *		�����Ϣ����
 * Parameter:
 *      [in]     handle          �ӿھ��  
 *      [in,out] pMsg            Pointer to message structure. 
 *      [in,out] pNumMsgs        Pointer to the location where number of messages to write is specified. On return will 
 *								 contain the actual number of messages that were transmitted (when Timeout is nonzero) or
 *								 placed in the transmit queue (when Timeout is zero). 
 *      [in]     Timeout         Write timeout (in milliseconds). When a value of 0 is specified, the function queues as 
 *								 many of the specified messages as possible and returns immediately. When a value 
 *								 greater than 0 is specified, the function will block until the Timeout has expired, an error 
 *                               has occurred, or the desired number of messages have been transmitted on the vehicle 
 *                               network. Even if the device can buffer only one packet at a time, this function shall be 
 *                               able to send an arbitrary number of packets ifa Timeout value is supplied. Since the 
 *                               function returns early if all the messages have been sent, there is normally no penalty for 
 *                               having a large timeout (several seconds).If the number of messages requested have 
 *                               been written, the function shall not return ERR_TIMEOUT, even if the timeout value is 
 *                               zero. 
 *                               When an ERR_TIMEOUT is returned, only the number of messages that were sent on 
 *                               the vehicle network is known. The numberof messages queued is unknown. Application 
 *                               writers should avoid this ambiguity by using a Timeout value large enough to work on 
 *                               slow devices and networks with arbitration delays. 
 *		[out]    ErrMsg          ���������Ϣ
 * Return: 
 *      ERR_NULL_PARAMETER     ����Ϊ��
 *		STATUS_NOERROR         �ɹ�
 *      ERR_FAILED		       �⻹û���ػ��߼���ʧ��
 * Others: 
 *		��ش��������ο�#j2534_v0404.hͷ�ļ�
 */
// long JKIT_API JK_PassThruWriteMsgs(JKitHandle *handle, PASSTHRU_MSG *pMsg, unsigned long *pNumMsgs, 
//										unsigned long Timeout, char *ErrMsg = NULL);

/*
 * Function: JK_PassThruStartPeriodicMsg
 * Description: 
 *		��ʼ�Զ��������
 * Parameter:
 *      [in]     handle          �ӿھ��  
 *      [in]     pMsg            Pointer to message structure. 
 *      [out]    pMsgID          Pointer to location for the message ID that is assigned by the DLL.
 *      [in]     TimeInterval    Time interval between the start ofsuccessive transmissions of this message, in 
 *                               milliseconds. The valid range is 5-65535 milliseconds. 
 *		[out]    ErrMsg          ���������Ϣ
 * Return: 
 *      ERR_NULL_PARAMETER     ����Ϊ��
 *		STATUS_NOERROR         �ɹ�
 *      ERR_FAILED		       �⻹û���ػ��߼���ʧ��
 * Others: 
 *		��ش��������ο�#j2534_v0404.hͷ�ļ�
 */
//long JKIT_API JK_PassThruStartPeriodicMsg(JKitHandle *handle, PASSTHRU_MSG *pMsg, unsigned long *pMsgID, 
//												unsigned long TimeInterval, char *ErrMsg = NULL);

/*
 * Function: JK_PassThruStopPeriodicMsg
 * Description: 
 *		ֹͣ�Զ������Ϣ����
 * Parameter:
 *      [in]     handle          �ӿھ��  
 *      [in]     pMsgID          Message ID that is assigned by the PassThruStartPeriodicMsg function
 *		[out]    ErrMsg          ���������Ϣ
 * Return: 
 *      ERR_NULL_PARAMETER     ����Ϊ��
 *		STATUS_NOERROR         �ɹ�
 *      ERR_FAILED		       �⻹û���ػ��߼���ʧ��
 * Others: 
 *		��ش��������ο�#j2534_v0404.hͷ�ļ�
 */
//long JKIT_API JK_PassThruStopPeriodicMsg(JKitHandle *handle, unsigned long MsgID, char *ErrMsg = NULL);


/*
 * Function: JK_PassThruStartMsgFilter
 * Description: 
 *		����Filter����
 * Parameter:
 *      [in]     handle          �ӿھ��  
 *      [in]     FilterType			PASS_FILTER �C allows matching messages intothe receive queue. This filter type is 
 *													only valid on non-ISO 15765 channels 
 *									BLOCK_FILTER �C keeps matching messages out of the receive queue. This filter 
 *								 					type is only valid on non-ISO 15765 channels 
 *									FLOW_CONTROL_FILTER �C allows matching messages into the receive queue and 
 *														defines an outgoing flow control message to support the ISO 15765-2 flow control 
 *														mechanism. This filter type is only valid on ISO 15765 channels. 
 *      [in]     pMaskMsg			For a PASS_FILTER or BLOCK_FILTER: 
 *										This designates a pointer to the mask message that will be applied to each incoming 
 *										message (i.e., the mask message that will be ANDed to each incoming message) to 
 *										mask any unimportant bits. 
 *									When using the CAN protocol, setting the first 4 bytes of pMaskMsg to $FF makes 
 *										the filter specific to one CAN ID. Using other values allows for the reception or 
 *										blocking of multiple CAN identifiers. 
 *									For a FLOW_CONTROL_FILTER: 
 *										The mask shall consist of 4 or 5 bytes of $FF, with a corresponding DataSize. Five 
 *										bytes are only allowed when the extended address bit in TxFlags is set. Flow control 
 *										filters are point-to-point, and shall not be allowed to match multiple CAN identifiers. 
 *										The only exception is to allow for masking the priority field in a 29-bit CAN ID as 
 *										specified in ISO 15765-2 Annex A. Inthis case Data[0] can be $E3.
 *      [in]     pPatternMsg		For a PASS_FILTER or BLOCK_FILTER: 
 *										Designates a pointer to the pattern message that will be compared to the incoming 
 *										message after the mask message has been applied. If the result matches this pattern 
 *										message and the FilterType is PASS_FILTER, then the incoming message will be 
 *										added to the receive queue (otherwise it will be discarded). If the result matches this 
 *										pattern message and the FilterType is BLOCK_FILTER, then the incoming message 
 *										will be discarded (otherwise it will be added to the receive queue). Message bytes in 
 *										the received message that are beyond the DataSize of the pattern message will be 
 *										treated as ��don��t care��. 
 *									For a FLOW_CONTROL_FILTER: 
 *										Designates a pointer to the CAN ID (with optional extended address) at the other end 
 *										of an ISO 15765-2 conversation. Any messages on the bus not matching a 
 *										pPatternMsg must be discarded. 
 *		[in]	 pFlowControlMsg	This pointer must be null when requesting a PASS_FILTER or a BLOCK_FILTER, 
 *										otherwise ERR_INVALID_MSG shall be returned. 
 *									For a FLOW_CONTROL_FILTER: 
 *										Designates a pointer to the CAN ID used when sending CAN frames during an ISO 
 *										15765-2 segmented transmission or reception. This is the CAN ID to match against 
 *										the CAN ID in a segmented PassThruWriteMsg. This message shall only contain the 
 *										CAN ID (and extended address byte if the ISO15765_EXT_ADDR flag is set).
 *      [out]	 pMsgID				Pointer to location for the filter ID that is assigned by the DLL.
 *		[out]    ErrMsg				���������Ϣ
 * Return: 
 *      ERR_NULL_PARAMETER     ����Ϊ��
 *		STATUS_NOERROR         �ɹ�
 *      ERR_FAILED		       �⻹û���ػ��߼���ʧ��
 * Others: 
 *		��ش��������ο�#j2534_v0404.hͷ�ļ�
 */
//long JKIT_API JK_PassThruStartMsgFilter(JKitHandle *handle,  unsigned long FilterType, 
//												PASSTHRU_MSG *pMaskMsg, PASSTHRU_MSG *pPatternMsg,
//												PASSTHRU_MSG *pFlowControlMsg, unsigned long *pMsgID, char *ErrMsg = NULL);

/*
 * Function: JK_PassThruStopPeriodicMsg
 * Description: 
 *		ֹͣFilter����
 * Parameter:
 *      [in]     handle        �ӿھ��  
 *      [in]     MsgID         Message ID that is assigned by the PassThruStartPeriodicMsg function
 * Return: 
 *      ERR_NULL_PARAMETER     ����Ϊ��
 *		STATUS_NOERROR         �ɹ�
 *      ERR_FAILED		       �⻹û���ػ��߼���ʧ��
 * Others: 
 *		��ش��������ο�#j2534_v0404.hͷ�ļ�
 */
//long JKIT_API JK_PassThruStopMsgFilter(JKitHandle *handle, unsigned long MsgID, char *ErrMsg = NULL);

/*
 * Function: JK_PassThruSetProgrammingVoltage
 * Description: 
 *		SetProgrammingVoltage
 * Parameter:
 *      [in]     handle        �ӿھ��  
 *      [in]     Pin		   The pin on which the programming voltage will be set. Valid options are: 
 *								0 �C Auxiliary output pin (for non-SAE J1962 connectors) 
 *								6 �C Pin 6 on the SAE J1962 connector. 
 *								9 �C Pin 9 on the SAE J1962 connector. 
 *								11 �C Pin 11 on the SAE J1962 connector. 
 *								12 �C Pin 12 on the SAE J1962 connector. 
 *								13 �C Pin 13 on the SAE J1962 connector. 
 *								14 �C Pin 14 on the SAE J1962 connector. 
 *								15 �C Pin 15 on the SAE J1962 connector (short to ground only). 
 *      [in]     Voltage       The voltage (in millivolts) to be set. Valid values are: 
 *								5000mV-20000mV (limited to 150mA with a resolution of 100 millivolts for pins 0, 6, 9, 
 *								11, 12, 13, and 14). 
 *								VOLTAGE_OFF �C To turn output off (disconnect-high impedance �� 500). 
 *								SHORT_TO_GROUND �C Short pin to ground (limited to 300mA on pin 15 only). 
 *                             ���ֵ��ο�SAE-J2534-1 page 35
 * Return: 
 *      ERR_NULL_PARAMETER     ����Ϊ��
 *		STATUS_NOERROR         �ɹ�
 *      ERR_FAILED		       �⻹û���ػ��߼���ʧ��
 * Others: 
 *		��ش��������ο�#j2534_v0404.hͷ�ļ�
 */
//long JKIT_API JK_PassThruSetProgrammingVoltage(JKitHandle *handle, unsigned long Pin, unsigned long Voltage, char *ErrMsg = NULL);

/*
 * Function: JK_PassThruReadVersion
 * Description: 
 *		��ȡJ2534 API Library �汾��Ϣ����
 * Parameter:
 *      [in]     handle				�ӿھ��  
 *      [out]    pFirmwareVersion	Pointer to Firmware version string.This string is determined by the interface vendor 
 *									that supplies the device.   
 *      [out]    pDllVersion        Pointer to DLL version string. This string is determined by the interface vendor that 
 *									supplies the DLL.    
 *      [out]    pApiVersion		Pointer to API version string in YY.MM format. This string corresponds to the date 
 *									of the approved document (may not be equivalent to SAE publication date). 
 *									February 2002 Final = ��02.02�� 
 *									November 2004 Final (this version) = ��04.04��
 * Return: 
 *      ERR_NULL_PARAMETER     ����Ϊ��
 *		STATUS_NOERROR         �ɹ�
 *      ERR_FAILED		       �⻹û���ػ��߼���ʧ��
 * Others: 
 *		��ش��������ο�#j2534_v0404.hͷ�ļ�
 */
//long JKIT_API JK_PassThruReadVersion(JKitHandle *handle, char *pFirmwareVersion, char *pDllVersion,
//										char *pApiVersion, char *ErrMsg = NULL);

/*
 * Function: JK_PassThruIoctl
 * Description: 
 *		PassThru Ioctl
 * Parameter:
 *      [in]     handle				�ӿھ��  
 *      [in]     IoctlID			Ioctl ID (see the IOCTL Section). 
 *      [in]     pInput				Pointer to input structure (see the IOCTL Section).  
 *      [out]    pOutput			Pointer to output structure (see the IOCTL Section). 
 * Return: 
 *      ERR_NULL_PARAMETER     ����Ϊ��
 *		STATUS_NOERROR         �ɹ�
 *      ERR_FAILED		       �⻹û���ػ��߼���ʧ��
 * Others: 
 *		��ش��������ο�#j2534_v0404.hͷ�ļ�
 */
//long JKIT_API JK_PassThruIoctl(JKitHandle *handle, unsigned long IoctlID, void *pInput, 
//										void *pOutput, char *ErrMsg = NULL);


/*
 * Function: JK_SenderIdByPassThruMsg
 * Description: 
 *		ͨ��PASSTHRU_MSG������ȡ��Ϣ������Id����
 * Parameter:
 *      [in]     msg				�ӿھ��  
 * Return: 
 *      long ��Ϣ������ID
 * Others: 
 *		��ش��������ο�#j2534_v0404.hͷ�ļ�
 */
//unsigned int JKIT_API JK_SenderIdByPassThruMsg(PASSTHRU_MSG *msg);

#ifdef __cplusplus
}
#endif

#endif
