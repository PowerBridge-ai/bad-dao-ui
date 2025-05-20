import React, { useMemo } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Heading,
  Text,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  useColorModeValue,
  Icon,
  Tooltip
} from '@chakra-ui/react';
import { VerificationResult, VerificationStatus, GroupedResults } from '../types';
import { 
  CheckCircleIcon, 
  QuestionIcon, 
  CloseIcon, 
  DownloadIcon, 
  RepeatIcon 
} from '@chakra-ui/icons';

interface ResultsDisplayProps {
  results: VerificationResult[];
  onExportExcel: () => void;
  onExportMarkdown: () => void;
  onRetryCaptcha: (platformId: string, email: string) => void;
  onAddCookie: (platformId: string) => void;
  isLoading: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  onExportExcel,
  onExportMarkdown,
  onRetryCaptcha,
  onAddCookie,
  isLoading
}) => {
  // Colors for different statuses
  const colors = {
    confirmed: useColorModeValue('green.500', 'green.300'),
    manual: useColorModeValue('orange.500', 'orange.300'),
    notFound: useColorModeValue('gray.500', 'gray.400'),
    error: useColorModeValue('red.500', 'red.300')
  };
  
  // Group results by status
  const groupedResults = useMemo<GroupedResults>(() => {
    return results.reduce(
      (acc, result) => {
        if (result.status === VerificationStatus.Confirmed) {
          acc.confirmed.push(result);
        } else if (
          result.status === VerificationStatus.ManualCheckRequired ||
          result.status === VerificationStatus.InProgress ||
          result.status === VerificationStatus.Error
        ) {
          acc.manualCheck.push(result);
        } else if (result.status === VerificationStatus.NotFound) {
          acc.notFound.push(result);
        }
        return acc;
      },
      { confirmed: [], manualCheck: [], notFound: [] } as GroupedResults
    );
  }, [results]);
  
  // Statistics
  const stats = useMemo(() => ({
    total: results.length,
    confirmed: groupedResults.confirmed.length,
    manualCheck: groupedResults.manualCheck.length,
    notFound: groupedResults.notFound.length
  }), [results.length, groupedResults]);
  
  // Get status badge
  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.Confirmed:
        return <Badge colorScheme="green">Confirmed</Badge>;
      case VerificationStatus.NotFound:
        return <Badge colorScheme="gray">Not Found</Badge>;
      case VerificationStatus.ManualCheckRequired:
        return <Badge colorScheme="orange">Manual Check</Badge>;
      case VerificationStatus.InProgress:
        return <Badge colorScheme="blue">In Progress</Badge>;
      case VerificationStatus.Error:
        return <Badge colorScheme="red">Error</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  if (results.length === 0) {
    return null;
  }

  return (
    <Box mt={8} width="100%">
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Verification Results</Heading>
        
        {/* Stats */}
        <StatGroup>
          <Stat>
            <StatLabel>Total Platforms</StatLabel>
            <StatNumber>{stats.total}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Confirmed</StatLabel>
            <StatNumber color={colors.confirmed}>{stats.confirmed}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Manual Check</StatLabel>
            <StatNumber color={colors.manual}>{stats.manualCheck}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Not Found</StatLabel>
            <StatNumber color={colors.notFound}>{stats.notFound}</StatNumber>
          </Stat>
        </StatGroup>
        
        {/* Export buttons */}
        <HStack spacing={4}>
          <Button 
            leftIcon={<DownloadIcon />} 
            colorScheme="teal" 
            onClick={onExportExcel}
            isDisabled={isLoading}
          >
            Export Excel
          </Button>
          <Button 
            leftIcon={<DownloadIcon />} 
            colorScheme="blue" 
            onClick={onExportMarkdown}
            isDisabled={isLoading}
          >
            Export Markdown
          </Button>
        </HStack>
        
        {/* Results tabs */}
        <Tabs variant="enclosed">
          <TabList>
            <Tab>All Results ({stats.total})</Tab>
            <Tab>Confirmed ({stats.confirmed})</Tab>
            <Tab>Manual Check ({stats.manualCheck})</Tab>
            <Tab>Not Found ({stats.notFound})</Tab>
          </TabList>
          
          <TabPanels>
            {/* All Results */}
            <TabPanel>
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Platform</Th>
                      <Th>Category</Th>
                      <Th>Status</Th>
                      <Th>Method</Th>
                      <Th>Retries</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {results.map((result, index) => (
                      <Tr key={index}>
                        <Td>{result.platform}</Td>
                        <Td>{result.category}</Td>
                        <Td>{getStatusBadge(result.status)}</Td>
                        <Td>{result.method || 'N/A'}</Td>
                        <Td>{result.retryCount}</Td>
                        <Td>
                          <HStack spacing={2}>
                            {result.status === VerificationStatus.ManualCheckRequired && (
                              <>
                                <Tooltip label="Retry with captcha solution">
                                  <Button 
                                    size="sm"
                                    colorScheme="blue"
                                    onClick={() => onRetryCaptcha(result.platform, result.email)}
                                  >
                                    <RepeatIcon />
                                  </Button>
                                </Tooltip>
                                <Tooltip label="Add cookie for this platform">
                                  <Button 
                                    size="sm"
                                    colorScheme="green"
                                    onClick={() => onAddCookie(result.platform)}
                                  >
                                    Add Cookie
                                  </Button>
                                </Tooltip>
                              </>
                            )}
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>
            
            {/* Confirmed */}
            <TabPanel>
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Platform</Th>
                      <Th>Category</Th>
                      <Th>Method</Th>
                      <Th>Timestamp</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {groupedResults.confirmed.map((result, index) => (
                      <Tr key={index}>
                        <Td>{result.platform}</Td>
                        <Td>{result.category}</Td>
                        <Td>{result.method || 'N/A'}</Td>
                        <Td>{new Date(result.timestamp).toLocaleString()}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>
            
            {/* Manual Check */}
            <TabPanel>
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Platform</Th>
                      <Th>Category</Th>
                      <Th>Flags</Th>
                      <Th>Retries</Th>
                      <Th>Notes</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {groupedResults.manualCheck.map((result, index) => (
                      <Tr key={index}>
                        <Td>{result.platform}</Td>
                        <Td>{result.category}</Td>
                        <Td>{result.flags?.join(', ') || 'None'}</Td>
                        <Td>{result.retryCount}</Td>
                        <Td>{result.notes || 'None'}</Td>
                        <Td>
                          <HStack spacing={2}>
                            <Tooltip label="Retry with captcha solution">
                              <Button 
                                size="sm"
                                colorScheme="blue"
                                onClick={() => onRetryCaptcha(result.platform, result.email)}
                              >
                                <RepeatIcon />
                              </Button>
                            </Tooltip>
                            <Tooltip label="Add cookie for this platform">
                              <Button 
                                size="sm"
                                colorScheme="green"
                                onClick={() => onAddCookie(result.platform)}
                              >
                                Add Cookie
                              </Button>
                            </Tooltip>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>
            
            {/* Not Found */}
            <TabPanel>
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Platform</Th>
                      <Th>Category</Th>
                      <Th>Method</Th>
                      <Th>Timestamp</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {groupedResults.notFound.map((result, index) => (
                      <Tr key={index}>
                        <Td>{result.platform}</Td>
                        <Td>{result.category}</Td>
                        <Td>{result.method || 'N/A'}</Td>
                        <Td>{new Date(result.timestamp).toLocaleString()}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default ResultsDisplay; 